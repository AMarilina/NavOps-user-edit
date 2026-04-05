package com.navops.api.application.service;

import com.navops.api.application.dto.request.LoginRequest;
import com.navops.api.application.dto.response.LoginResponse;
import com.navops.api.domain.entity.LoginAttempt;
import com.navops.api.domain.entity.User;
import com.navops.api.infrastructure.exception.UserNotFoundException;
import com.navops.api.repository.LoginAttemptRepository;
import com.navops.api.repository.UserRepository;
import com.navops.api.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final LoginAttemptRepository loginAttemptRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final HttpServletRequest request;

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCKOUT_MINUTES = 15;

    @Transactional
    public LoginResponse login(LoginRequest loginRequest) {
        String ipAddress = getClientIp(request);
        String username = loginRequest.username();

        // 1. Check if user/IP is blocked
        checkLockoutStatus(username, ipAddress);

        try {
            // 2. Validate credentials via Spring Security
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, loginRequest.password())
            );
            
            // 3. Register success
            recordLoginAttempt(username, ipAddress, true);

            // 4. Generate Token and formulate response
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new BadCredentialsException("User not found after successful authentication"));
                    
            String roleName = user.getRole().getName();
            String jwtToken = jwtService.generateToken(new HashMap<>(), user);

            String redirectUrl = determineRedirectUrl(roleName);

            return new LoginResponse(jwtToken, user.getId(), roleName, redirectUrl);

        } catch (BadCredentialsException ex) {
            // Register failed attempt
            recordLoginAttempt(username, ipAddress, false);
            log.warn("Failed login attempt for username: {} from IP: {}", username, ipAddress);
            throw new BadCredentialsException("Usuario o contraseña incorrectos");
        }
    }

    private void checkLockoutStatus(String username, String ipAddress) {
        OffsetDateTime lockoutTimeWindow = OffsetDateTime.now().minusMinutes(LOCKOUT_MINUTES);
        
        int failedAttempts = loginAttemptRepository.countByUsernameAndSuccessFalseAndAttemptTimeAfter(username, lockoutTimeWindow);
        
        if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
            log.warn("User {} is temporarily blocked due to excessive failed login attempts", username);
            throw new LockedException("Demasiados intentos fallidos. Su cuenta está bloqueada temporalmente por " + LOCKOUT_MINUTES + " minutos.");
        }
    }

    private void recordLoginAttempt(String username, String ipAddress, boolean success) {
        LoginAttempt attempt = LoginAttempt.builder()
                .username(username)
                .ipAddress(ipAddress)
                .success(success)
                .build();
        loginAttemptRepository.save(attempt);
    }

    private String getClientIp(HttpServletRequest request) {
        // MVP: Try to get from header, fallback to remote connection IP
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private String determineRedirectUrl(String roleName) {
        return switch (roleName.toUpperCase()) {
            case "ADMIN" -> "/dashboard/admin";
            case "CHIEF_NAVIGATION" -> "/dashboard/navigation";
            case "CHIEF_OPERATIONS" -> "/dashboard/operations";
            default -> "/";
        };
    }

    public void forgotPassword(String email) {
        log.info("Iniciando proceso de recuperación de contraseña para: {}", email);
        User user = userRepository.findByEmail(email).orElseThrow(UserNotFoundException::new);
        String resetToken = jwtService.generatePasswordResetToken(user);
        EmailService emailService = new EmailService();
        emailService.sendPasswordRecoveryEmail(user.getEmail(), resetToken);
        log.info("Correo enviado al usuario con id: {}", user.getId());
        log.warn("Intento de recuperación para correo inexistente: {}", email);
    }
}

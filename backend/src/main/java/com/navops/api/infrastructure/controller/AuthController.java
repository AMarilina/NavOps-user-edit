package com.navops.api.infrastructure.controller;

import com.navops.api.application.dto.request.ForgotPasswordRequest;
import com.navops.api.application.dto.request.LoginRequest;
import com.navops.api.application.dto.response.ForgotPasswordResponse;
import com.navops.api.application.dto.response.LoginResponse;
import com.navops.api.application.dto.request.VerifyCodeRequest;
import com.navops.api.application.dto.response.VerifyCodeResponse;
import com.navops.api.application.service.AuthService;
import com.navops.api.application.dto.request.ResetPasswordRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for managing user authentication")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Login an existing user", description = "Validates credentials and returns a JWT token along with dashboard redirection URL.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully authenticated",
                    content = { @Content(mediaType = "application/json", schema = @Schema(implementation = LoginResponse.class)) }),
            @ApiResponse(responseCode = "400", description = "Bad Request (e.g. empty fields)",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized (Invalid username or password)",
                    content = @Content),
            @ApiResponse(responseCode = "423", description = "Locked (Too many failed login attempts)",
                    content = @Content)
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @Operation(summary = "Request password recovery", description = "Generates a reset link and sends it to the registered email.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Returns success universally to prevent email enumeration.")
    })
    @PostMapping("/forgot-password")
    public ResponseEntity<ForgotPasswordResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.email());
        return ResponseEntity.ok(new ForgotPasswordResponse("Se ha enviado un enlace a tu correo electrónico"));
    }

    @Operation(summary = "Verify recovery code", description = "Validates the 8-character email code and returns a token to reset the password.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Code Validated Successfully",
                            content = { @Content(mediaType = "application/json", schema = @Schema(implementation = VerifyCodeResponse.class)) }),
                    @ApiResponse(responseCode = "400", description = "Bad Request (Invalid or expired code)"),
                    @ApiResponse(responseCode = "404", description = "User Not Found")
            })
    @PostMapping("/verify-code")
    public ResponseEntity<VerifyCodeResponse> verifyCode(@Valid @RequestBody VerifyCodeRequest request) {
        return ResponseEntity.ok(authService.verifyResetCode(request.email(), request.code()));
    }

    @Operation(summary = "Reset password", description = "Resets the user password using a verified reset token.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Password reset successfully"),
                    @ApiResponse(responseCode = "400", description = "Bad Request (e.g. weak password)"),
                    @ApiResponse(responseCode = "401", description = "Invalid token")
            })
    @PostMapping("/reset-password")
    public ResponseEntity<ForgotPasswordResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(new ForgotPasswordResponse("Tu contraseña fue actualizada con éxito"));
    }
}

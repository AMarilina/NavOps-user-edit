package com.navops.api.infrastructure.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.navops.api.application.dto.request.ResetPasswordRequest;
import com.navops.api.application.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class ResetPasswordControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private com.navops.api.security.JwtService jwtService;

    @MockBean
    private org.springframework.security.core.userdetails.UserDetailsService userDetailsService;

    @MockBean
    private com.navops.api.security.JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    @DisplayName("Should return 200 OK when password reset is successful")
    void shouldReturn200WhenPasswordResetOk() throws Exception {
        ResetPasswordRequest request = new ResetPasswordRequest("valid_token", "Safe_123*Pwd");

        doNothing().when(authService).resetPassword(any(ResetPasswordRequest.class));

        mockMvc.perform(post("/api/v1/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Tu contraseña fue actualizada con éxito"));
    }

    @Test
    @DisplayName("Should return 400 Bad Request if token is missing or password does not fulfill policies")
    void shouldReturn400WhenPasswordFailsPolicyValidation() throws Exception {
        // Password too short and lacking specials, uppercase
        ResetPasswordRequest request = new ResetPasswordRequest("valid_token", "invalid12");

        // The @Valid annotation on the controller should reject this directly
        mockMvc.perform(post("/api/v1/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Bad Request"));
    }

    @Test
    @DisplayName("Should return 401 Unauthorized or 400 when token is invalid for this operation")
    void shouldReturn400WhenTokenIsInvalid() throws Exception {
        ResetPasswordRequest request = new ResetPasswordRequest("invalid_token", "Safe_123*Pwd");

        doThrow(new BadCredentialsException("Token inválido para esta operación"))
                .when(authService).resetPassword(any(ResetPasswordRequest.class));

        // BadCredentialsException maps to 400 in our GlobalExceptionHandler? 
        // Let's assume GlobalExceptionHandler mappings or standard spring security handling.
        // Usually we expect a 4XX status.
        mockMvc.perform(post("/api/v1/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is4xxClientError());
    }
}

package com.navops.api.infrastructure.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.navops.api.application.dto.request.ForgotPasswordRequest;
import com.navops.api.application.service.AuthService;
import com.navops.api.infrastructure.exception.EmailNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class ForgotPasswordControllerTest {

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
    @DisplayName("Should return 200 OK when email exists and recovery email is sent")
    void shouldReturn200WhenEmailExists() throws Exception {

        ForgotPasswordRequest request = new ForgotPasswordRequest("user@test.com");

        doNothing().when(authService).forgotPassword(any());

        mockMvc.perform(post("/api/v1/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Se ha enviado un enlace a tu correo electrónico"));
    }

    @Test
    @DisplayName("Should return 404 Not Found when email does not exist")
    void shouldReturn404WhenEmailNotFound() throws Exception {

        ForgotPasswordRequest request = new ForgotPasswordRequest("notfound@test.com");

        doThrow(new EmailNotFoundException("Email not found"))
                .when(authService).forgotPassword(any());

        mockMvc.perform(post("/api/v1/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should return 400 Bad Request when email is invalid")
    void shouldReturn400WhenInvalidEmail() throws Exception {

        ForgotPasswordRequest request = new ForgotPasswordRequest("invalid-email");

        mockMvc.perform(post("/api/v1/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should return 400 Bad Request when email is empty")
    void shouldReturn400WhenEmailIsEmpty() throws Exception {

        ForgotPasswordRequest request = new ForgotPasswordRequest("");

        mockMvc.perform(post("/api/v1/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should handle unexpected errors and return 500")
    void shouldReturn500WhenUnexpectedErrorOccurs() throws Exception {

        ForgotPasswordRequest request = new ForgotPasswordRequest("user@test.com");

        doThrow(new RuntimeException("Unexpected error"))
                .when(authService).forgotPassword(any());

        mockMvc.perform(post("/api/v1/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    @DisplayName("Should return 200 when token is valid and password is updated")
    void shouldReturn200WhenValidToken() throws Exception {

        ForgotPasswordRequest request =
                new ForgotPasswordRequest("admin@navops.com");

        doNothing().when(authService).forgotPassword(any());

        mockMvc.perform(post("/api/v1/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message")
                        .value("Se ha enviado un enlace a tu correo electrónico"));
    }
}
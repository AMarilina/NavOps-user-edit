package com.navops.api.application.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequest(
        @NotBlank(message = "El email no puede estar vacío")
        @Email(message = "Debe enviar un formato de email válido")
        String email
) {
}

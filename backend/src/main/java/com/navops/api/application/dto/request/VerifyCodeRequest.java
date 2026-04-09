package com.navops.api.application.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record VerifyCodeRequest(
        @NotBlank(message = "El correo no puede estar vacío")
        @Email(message = "Debe ser un correo válido")
        String email,

        @NotBlank(message = "El código no puede estar vacío")
        @Size(min = 8, max = 15, message = "Formato de código inválido")
        String code
) {
}

package com.navops.api.application.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Validación de correo para recuperación de contraseña")
public record ForgotPasswordRequest(

        @Schema(example = "admin@gmail.com", requiredMode = Schema.RequiredMode.REQUIRED, description = "Insertar el correo del usuario")
        @NotBlank(message = "El email no puede estar vacío")
        @Email(message = "Debe enviar un formato de email válido")
        String email
) {
}

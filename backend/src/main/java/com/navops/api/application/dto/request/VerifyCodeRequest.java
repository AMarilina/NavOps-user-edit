package com.navops.api.application.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Solicitud para verificar el código enviado por correo")
public record VerifyCodeRequest(

        @Schema(example = "oficial.logistica@navops.com")
        @NotBlank(message = "El correo no puede estar vacío")
        @Email(message = "Debe ser un correo válido")
        String email,

        @Schema(example = "NV12-8A29", description = "Código alfanumérico de 8 caracteres")
        @NotBlank(message = "El código no puede estar vacío")
        @Size(min = 8, max = 15, message = "Formato de código inválido")
        String code
) {
}

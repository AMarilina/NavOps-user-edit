package com.navops.api.application.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Credenciales de acceso al sistema NavOps")
public record LoginRequest(

        @Schema(example = "admin_maritimo", requiredMode = Schema.RequiredMode.REQUIRED, description = "Nombre de usuario único" )
        @NotBlank(message = "El nombre de usuario es obligatorio")
        String username,

        @Schema(example = "P@ssword123!", requiredMode = Schema.RequiredMode.REQUIRED, description = "Contraseña de acceso")
        @NotBlank(message = "La contraseña es obligatoria")
        String password
) {}

package com.navops.api.application.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Schema(description = "Restauración de la contraseña")
public record ResetPasswordRequest(

        @Schema(example = "eyJhbGciOiJIUzUxMiJ9.eyJyZXNldCI6dHJ1ZSwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzU3ODYzNzIsImV4cCI6MTc3NTc4NzI3Mn0.mPHfaM7QHKvgXFwvhHbeuBBMUKBALXkG_8WJZ2gaZZz_PQVNJ8s6vSshZKK5PVmZlgcGgu1QHEsZPHf-9WzG0w",
                requiredMode = Schema.RequiredMode.REQUIRED, description = "Token unico para la restauración de contraseña")
        @NotBlank(message = "El token es obligatorio")
        String token,

        @Schema(example = "Admin123$", requiredMode = Schema.RequiredMode.REQUIRED, description = "solicitud de la nueva contraseña")
        @NotBlank(message = "La contraseña es obligatoria")
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&._-])[A-Za-z\\d@$!%*?&._-]{8,}$",
                message = "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial")
        String newPassword
) {
}

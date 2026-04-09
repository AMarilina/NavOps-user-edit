package com.navops.api.application.dto.response;

public record VerifyCodeResponse(
        String message,
        String resetToken // El token temporal para permitir el cambio de contraseña
) {
}

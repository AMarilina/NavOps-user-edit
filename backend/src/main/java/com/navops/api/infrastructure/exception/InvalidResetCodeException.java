package com.navops.api.infrastructure.exception;

public class InvalidResetCodeException extends RuntimeException {
    public InvalidResetCodeException() {
        super("Código inválido");
    }
}

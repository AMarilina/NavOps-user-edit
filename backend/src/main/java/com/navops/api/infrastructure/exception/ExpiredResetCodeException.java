package com.navops.api.infrastructure.exception;

public class ExpiredResetCodeException extends RuntimeException {
    public ExpiredResetCodeException() {
        super("Código expirado");
    }
}

package com.navops.api.infrastructure.exception;

public class EmailNotFoundException extends RuntimeException{

    public EmailNotFoundException(String message) {
        super("Correo electrónico no encontrado");
    }
}


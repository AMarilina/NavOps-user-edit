package com.navops.api.infrastructure.exception;

public class UserNotFoundException extends RuntimeException{

    public UserNotFoundException() {
        super("Correo no encontrado o no registrado");
    }
}

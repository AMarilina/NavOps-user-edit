package com.navops.api.domain.enums;

public enum MaritalStatusEnum {

    SOLTERO("Estado civil soltero"),
    CASADO("Estado civil casado"),
    DIVORCIADO("Estado civil divorciado"),
    VIUDO("Estado civil viudo"),
    CONVIVIENTE("Estado civil conviviente");

    private final String description;

    MaritalStatusEnum( String description){
        this.description = description;
    }

}

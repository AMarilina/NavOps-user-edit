package com.navops.api.domain.enums;

public enum GenderEnum {

    MASCULINO("Genero masculino"),
    FEMENINO("Genero femenino"),
    OTRO("Prefiero no decirlo");

    private final String description;

    GenderEnum(String description) {
        this.description = description;
    }
}

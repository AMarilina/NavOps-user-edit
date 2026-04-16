package com.navops.api.domain.enums;

public enum DocumentTypeEnum {

    DNI("Documento Nacional de Identidad"),
    PASAPORTE("Pasaporte"),
    CEDULA("Cedula de identidad");

    private final String description;

    DocumentTypeEnum(String description) {
        this.description = description;
    }
}

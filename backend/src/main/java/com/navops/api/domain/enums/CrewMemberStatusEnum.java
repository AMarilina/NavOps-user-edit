package com.navops.api.domain.enums;

public enum CrewMemberStatusEnum {

    ACTIVO("Personal activo"),
    INACTIVO("Personal inactivo"),
    LICENCIA("Personal con licencia por enfermedad, vacaciones, estudios, etc."),
    SUSPENDIDO("personal suspendido");

    private final String description;

    CrewMemberStatusEnum(String description){
        this.description = description;
    }
}

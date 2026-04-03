package com.navops.api.application.dto.response;

import java.time.OffsetDateTime;

public record ErrorResponse(
        String error,
        String message,
        int status,
        OffsetDateTime timestamp
) {}

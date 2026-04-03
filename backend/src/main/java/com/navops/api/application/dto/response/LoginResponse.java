package com.navops.api.application.dto.response;

import java.util.UUID;

public record LoginResponse(
        String token,
        UUID userId,
        String role,
        String redirectUrl
) {}

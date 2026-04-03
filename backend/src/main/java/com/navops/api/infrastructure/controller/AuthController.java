package com.navops.api.infrastructure.controller;

import com.navops.api.application.dto.request.LoginRequest;
import com.navops.api.application.dto.response.LoginResponse;
import com.navops.api.application.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for managing user authentication")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Login an existing user", description = "Validates credentials and returns a JWT token along with dashboard redirection URL.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully authenticated",
                    content = { @Content(mediaType = "application/json", schema = @Schema(implementation = LoginResponse.class)) }),
            @ApiResponse(responseCode = "400", description = "Bad Request (e.g. empty fields)",
                    content = @Content),
            @ApiResponse(responseCode = "401", description = "Unauthorized (Invalid username or password)",
                    content = @Content),
            @ApiResponse(responseCode = "423", description = "Locked (Too many failed login attempts)",
                    content = @Content)
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }
}

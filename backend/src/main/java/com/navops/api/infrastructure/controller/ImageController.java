package com.navops.api.infrastructure.controller;

import com.navops.api.application.service.ImageStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/images")
@RequiredArgsConstructor
@Tag(name = "Images", description = "Endpoints for generic image uploads to Cloudinary")
public class ImageController {

    private final ImageStorageService imageStorageService;

    @Operation(summary = "Uploads an image to Cloudinary", description = "Expects a MultipartFile and a string for the folder name (e.g., 'profile_pictures', 'ships'). Returns the secure URL.")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadResponse> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "general") String folder) {
        
        try {
            String url = imageStorageService.uploadImage(file, folder);
            return ResponseEntity.ok(new UploadResponse(url));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Java 21 Record for clean JSON response
    public record UploadResponse(String url) {}
}

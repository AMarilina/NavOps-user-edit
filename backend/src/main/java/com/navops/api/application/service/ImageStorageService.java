package com.navops.api.application.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImageStorageService {

    private final Cloudinary cloudinary;

    /**
     * Uploads an image to Cloudinary in a specific folder.
     *
     * @param file the multipart file to upload
     * @param folder the folder name in Cloudinary (e.g. "profile_pictures", "ships", "system_assets")
     * @return the secure URL of the uploaded image
     * @throws IOException if there's an error reading the file or communicating with Cloudinary
     */
    public String uploadImage(MultipartFile file, String folder) throws IOException {
        log.info("Uploading image to Cloudinary in folder: {}", folder);
        
        Map<String, Object> options = ObjectUtils.asMap(
                "folder", folder,
                "use_filename", true,
                "unique_filename", true,
                "overwrite", false
        );

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
        
        String url = uploadResult.get("secure_url").toString();
        log.info("Image uploaded successfully. URL: {}", url);
        
        return url;
    }

    /**
     * Deletes an image from Cloudinary using its public ID.
     *
     * @param publicId the public ID of the image in Cloudinary
     */
    public void deleteImage(String publicId) {
        log.info("Deleting image from Cloudinary with publicId: {}", publicId);
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Image deleted successfully.");
        } catch (IOException e) {
            log.error("Failed to delete image with publicId: {}", publicId, e);
        }
    }
}

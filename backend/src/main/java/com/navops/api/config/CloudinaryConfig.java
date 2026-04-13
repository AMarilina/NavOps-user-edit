package com.navops.api.config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Value("${CLOUDINARY_NAME}")
    private String cloudName;

    @Value("${CLOUDINARY_KEY}")
    private String apiKey;

    @Value("${CLOUDINARY_SECRET}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", cloudName);
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);
        return new Cloudinary(config);
    }

   /* @Bean
    public Cloudinary cloudinary() {
        // Asume que la variable de entorno CLOUDINARY_URL está configurada
        // El framework de Cloudinary automáticamente buscará "CLOUDINARY_URL"
        // Si no, podemos pasarle un Map de configuracion manual pero por defecto es la mejor practica.
        return new Cloudinary();
    }dqt6c5PCKDaKFX6iek8XcNzPq9w*/
}

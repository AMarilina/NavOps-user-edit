package com.navops.api.application.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    // Comentado para el próximo sprint. Ya preparado para usarse nativamente.
    // private final JavaMailSender javaMailSender;

    public void sendPasswordRecoveryEmail(String toEmail, String resetToken) {
        // En un escenario real, cargaríamos una plantilla HTML y enviaríamos el mail vía JavaMailSender
        String urlRecuperacion = "http://localhost:5173/reset-password?token=" + resetToken;
        
        log.info("===============================================================");
        log.info("[MOCK MAIL SERVICE] Se ha simulado el envío de un correo.");
        log.info("Destinatario: {}", toEmail);
        log.info("Asunto: Recuperación de Contraseña - NavOps");
        log.info("Cuerpo del mensaje: Has solicitado recuperar tu contraseña.");
        log.info("Enlace de recuperación: {}", urlRecuperacion);
        log.info("===============================================================");
    }
}

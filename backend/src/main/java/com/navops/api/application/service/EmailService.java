package com.navops.api.application.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendPasswordRecoveryEmail(String toEmail, String code) {
        log.info("Generando correo de recuperación para: {}", toEmail);
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("NavOps - Código de Recuperación de Contraseña");

            Context context = new Context();
            context.setVariable("email", toEmail);
            context.setVariable("code", code);

            String htmlContent = templateEngine.process("password-recovery", context);
            helper.setText(htmlContent, true);
            log.info("FROM EMAIL CONFIG: {}", fromEmail);
            javaMailSender.send(mimeMessage);
            log.info("Correo enviado exitosamente a: {}", toEmail);

        } catch (MessagingException e) {
            log.error("Error al enviar el correo a: {}", toEmail, e);
            throw new RuntimeException("No se pudo enviar el correo de recuperación", e);
        } catch (Exception e) {
        log.error("ERROR REAL AL ENVIAR MAIL:", e);
        throw new RuntimeException("No se pudo enviar el correo", e);
    }
    }
}

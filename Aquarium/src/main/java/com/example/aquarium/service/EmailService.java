// EmailService.java
package com.example.aquarium.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    private static final String SUBJECT = "Account registration verification code";

    private final JavaMailSender mailSender;
    public String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }


    public String sendVerificationCode(String toEmail) {
        String code = generateVerificationCode();
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(SUBJECT);
        message.setText("Your verification code is: " + code);

        try {
            mailSender.send(message);
            logger.info("Verification code sent to email: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send verification code to email: {}", toEmail, e);
            throw new RuntimeException("Failed to send verification code. Please try again later.");
        }

        return code;
    }
}

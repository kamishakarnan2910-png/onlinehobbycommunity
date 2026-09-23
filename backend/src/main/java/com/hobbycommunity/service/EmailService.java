package com.hobbycommunity.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String toEmail, String token) {

        String verificationLink =
                "http://localhost:8080/api/email-verification/verify?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "Online Hobby Community - Email Verification"
        );

        message.setText(
                "Welcome to Online Hobby Community!\n\n" +
                "Please click the link below to verify your email:\n\n" +
                verificationLink +
                "\n\nThis link is valid for 24 hours."
        );

        mailSender.send(message);
    }

    public void sendLoginOtpEmail(
            String toEmail,
            String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);

        message.setSubject(
                "Online Hobby Community - Login OTP"
        );

        message.setText(
                "Your login OTP is: " + otp +
                "\n\nThis OTP is valid for 5 minutes."
        );

        mailSender.send(message);
    }
}
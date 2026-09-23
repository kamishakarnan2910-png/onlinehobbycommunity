package com.hobbycommunity.controller;

import com.hobbycommunity.service.EmailVerificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email-verification")
@CrossOrigin(origins = "*")
public class EmailVerificationController {

    private final EmailVerificationService verificationService;

    public EmailVerificationController(
            EmailVerificationService verificationService) {

        this.verificationService = verificationService;
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyEmail(
            @RequestParam String token) {

        boolean verified =
                verificationService.verifyToken(token);

        if (!verified) {
            return ResponseEntity.badRequest()
                    .body("Invalid or expired verification token.");
        }

        return ResponseEntity.ok(
                "Email verified successfully! You can now login."
        );
    }
}
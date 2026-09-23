package com.hobbycommunity.controller;

import com.hobbycommunity.entity.EmailVerificationToken;
import com.hobbycommunity.entity.User;
import com.hobbycommunity.service.EmailService;
import com.hobbycommunity.service.EmailVerificationService;
import com.hobbycommunity.service.LoginOtpService;
import com.hobbycommunity.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final EmailVerificationService emailVerificationService;
    private final EmailService emailService;
    private final LoginOtpService loginOtpService;

    public UserController(
            UserService userService,
            EmailVerificationService emailVerificationService,
            EmailService emailService,
            LoginOtpService loginOtpService) {

        this.userService = userService;
        this.emailVerificationService = emailVerificationService;
        this.emailService = emailService;
        this.loginOtpService = loginOtpService;
    }

    @PostMapping
    public ResponseEntity<User> createUser(
            @RequestBody User user) {

        return ResponseEntity.ok(
                userService.createUser(user)
        );
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(
            @PathVariable Integer id) {

        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(
            @PathVariable String email) {

        return userService.getUserByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/check-email/{email}")
    public ResponseEntity<Boolean> checkEmail(
            @PathVariable String email) {

        return ResponseEntity.ok(
                userService.emailExists(email)
        );
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        boolean valid = userService.checkPassword(
                request.getEmail(),
                request.getPassword()
        );

        if (!valid) {
            return ResponseEntity.status(401)
                    .body("Invalid email or password.");
        }

        Optional<User> userOptional =
                userService.getUserByEmail(
                        request.getEmail()
                );

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404)
                    .body("User not found.");
        }

        User user = userOptional.get();

        if (!user.getEmailVerified()) {
            return ResponseEntity.status(403)
                    .body("Please verify your email first.");
        }

        var otp = loginOtpService.createOtp(user);

        emailService.sendLoginOtpEmail(
                user.getEmail(),
                otp.getOtp()
        );

        return ResponseEntity.ok(
                "OTP sent to your email."
        );
    }

    @PostMapping("/admin-login")
    public ResponseEntity<?> adminLogin(
            @RequestBody LoginRequest request) {

        boolean valid = userService.checkPassword(
                request.getEmail(),
                request.getPassword()
        );

        if (!valid) {
            return ResponseEntity.status(401)
                    .body("Invalid email or password.");
        }

        Optional<User> userOptional =
                userService.getUserByEmail(
                        request.getEmail()
                );

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404)
                    .body("User not found.");
        }

        User user = userOptional.get();

        if (!"ADMIN".equalsIgnoreCase(
                user.getRole())) {

            return ResponseEntity.status(403)
                    .body("Access denied. Admin only.");
        }

        if (!user.getEmailVerified()) {
            return ResponseEntity.status(403)
                    .body("Please verify your email first.");
        }

        var otp = loginOtpService.createOtp(user);

        emailService.sendLoginOtpEmail(
                user.getEmail(),
                otp.getOtp()
        );

        return ResponseEntity.ok(
                "Admin OTP sent to your email."
        );
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody OtpRequest request) {

        Optional<User> userOptional =
                userService.getUserByEmail(
                        request.getEmail()
                );

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404)
                    .body("User not found.");
        }

        boolean verified =
                loginOtpService.verifyOtp(
                        userOptional.get().getId(),
                        request.getOtp()
                );

        if (!verified) {
            return ResponseEntity.status(401)
                    .body("Invalid or expired OTP.");
        }

        return ResponseEntity.ok(
                userOptional.get()
        );
    }

    @GetMapping("/email-verification-token")
    public ResponseEntity<String> testVerificationToken(
            @RequestParam String email) {

        Optional<User> userOptional =
                userService.getUserByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        EmailVerificationToken token =
                emailVerificationService.createToken(
                        userOptional.get()
                );

        emailService.sendVerificationEmail(
                email,
                token.getToken()
        );

        return ResponseEntity.ok(
                "Verification email sent successfully."
        );
    }

    public static class LoginRequest {

        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class OtpRequest {

        private String email;
        private String otp;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getOtp() {
            return otp;
        }

        public void setOtp(String otp) {
            this.otp = otp;
        }
    }
}
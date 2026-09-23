package com.hobbycommunity.service;

import com.hobbycommunity.entity.EmailVerificationToken;
import com.hobbycommunity.entity.User;
import com.hobbycommunity.repository.EmailVerificationTokenRepository;
import com.hobbycommunity.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationService emailVerificationService;
    private final EmailService emailService;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            EmailVerificationService emailVerificationService,
            EmailService emailService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailVerificationService = emailVerificationService;
        this.emailService = emailService;
    }

    public User createUser(User user) {

        user.setEmail(user.getEmail().trim());

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        user.setEmailVerified(false);

        if (user.getRole() == null ||
                user.getRole().isBlank()) {

            user.setRole("USER");
        }

        User savedUser =
                userRepository.save(user);

        EmailVerificationToken token =
                emailVerificationService.createToken(
                        savedUser
                );

        System.out.println(
                "EMAIL VERIFICATION TOKEN: "
                        + token.getToken()
        );

        emailService.sendVerificationEmail(
                savedUser.getEmail(),
                token.getToken()
        );

        return savedUser;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {

        if (email == null) {
            return Optional.empty();
        }

        return userRepository.findByEmail(
                email.trim()
        );
    }

    public boolean emailExists(String email) {

        if (email == null) {
            return false;
        }

        return userRepository.existsByEmail(
                email.trim()
        );
    }

    public boolean checkPassword(
            String email,
            String password) {

        if (email == null || password == null) {
            return false;
        }

        Optional<User> user =
                userRepository.findByEmail(
                        email.trim()
                );

        if (user.isEmpty()) {
            return false;
        }

        return passwordEncoder.matches(
                password,
                user.get().getPassword()
        );
    }
}
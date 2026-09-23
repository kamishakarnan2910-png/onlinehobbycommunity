package com.hobbycommunity.service;

import com.hobbycommunity.entity.EmailVerificationToken;
import com.hobbycommunity.entity.User;
import com.hobbycommunity.repository.EmailVerificationTokenRepository;
import com.hobbycommunity.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class EmailVerificationService {

    private final EmailVerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;

    public EmailVerificationService(
            EmailVerificationTokenRepository tokenRepository,
            UserRepository userRepository) {

        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
    }

    public EmailVerificationToken createToken(User user) {

        tokenRepository.deleteByUserId(user.getId());

        EmailVerificationToken token =
                new EmailVerificationToken();

        token.setUserId(user.getId());

        token.setToken(UUID.randomUUID().toString());

        token.setExpiryDate(
                LocalDateTime.now().plusHours(24)
        );

        return tokenRepository.save(token);
    }

    public boolean verifyToken(String tokenValue) {

        Optional<EmailVerificationToken> tokenOptional =
                tokenRepository.findByToken(tokenValue);

        if (tokenOptional.isEmpty()) {
            return false;
        }

        EmailVerificationToken token =
                tokenOptional.get();

        if (token.getExpiryDate()
                .isBefore(LocalDateTime.now())) {

            return false;
        }

        Optional<User> userOptional =
                userRepository.findById(token.getUserId());

        if (userOptional.isEmpty()) {
            return false;
        }

        User user = userOptional.get();

        user.setEmailVerified(true);

        userRepository.save(user);

        tokenRepository.delete(token);

        return true;
    }
}
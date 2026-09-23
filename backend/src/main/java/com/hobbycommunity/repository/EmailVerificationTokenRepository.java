package com.hobbycommunity.repository;

import com.hobbycommunity.entity.EmailVerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailVerificationTokenRepository
        extends JpaRepository<EmailVerificationToken, Integer> {

    Optional<EmailVerificationToken> findByToken(String token);

    void deleteByUserId(Integer userId);
}
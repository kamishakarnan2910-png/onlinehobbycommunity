package com.hobbycommunity.repository;

import com.hobbycommunity.entity.LoginOtp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LoginOtpRepository
        extends JpaRepository<LoginOtp, Integer> {

    Optional<LoginOtp> findByUserId(Integer userId);

    Optional<LoginOtp> findByUserIdAndOtp(
            Integer userId,
            String otp
    );

    void deleteByUserId(Integer userId);
}
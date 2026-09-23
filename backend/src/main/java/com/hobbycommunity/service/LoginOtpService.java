package com.hobbycommunity.service;

import com.hobbycommunity.entity.LoginOtp;
import com.hobbycommunity.entity.User;
import com.hobbycommunity.repository.LoginOtpRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class LoginOtpService {

    private final LoginOtpRepository otpRepository;

    public LoginOtpService(LoginOtpRepository otpRepository) {
        this.otpRepository = otpRepository;
    }

    @Transactional
    public LoginOtp createOtp(User user) {

        otpRepository.deleteByUserId(user.getId());

        LoginOtp otp = new LoginOtp();

        otp.setUserId(user.getId());

        String otpValue =
                String.format(
                        "%06d",
                        new Random().nextInt(1000000)
                );

        otp.setOtp(otpValue);

        otp.setExpiryTime(
                LocalDateTime.now().plusMinutes(5)
        );

        return otpRepository.save(otp);
    }

    @Transactional
    public boolean verifyOtp(
            Integer userId,
            String otpValue) {

        Optional<LoginOtp> optionalOtp =
                otpRepository.findByUserIdAndOtp(
                        userId,
                        otpValue
                );

        if (optionalOtp.isEmpty()) {
            return false;
        }

        LoginOtp otp = optionalOtp.get();

        if (otp.getExpiryTime()
                .isBefore(LocalDateTime.now())) {

            otpRepository.delete(otp);
            return false;
        }

        otpRepository.delete(otp);

        return true;
    }
}
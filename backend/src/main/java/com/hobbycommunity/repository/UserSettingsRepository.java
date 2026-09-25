package com.hobbycommunity.repository;

import com.hobbycommunity.entity.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserSettingsRepository
        extends JpaRepository<UserSettings, Integer> {

    Optional<UserSettings> findByUserId(Integer userId);
}
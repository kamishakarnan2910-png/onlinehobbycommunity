package com.hobbycommunity.repository;

import com.hobbycommunity.entity.Settings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SettingsRepository extends JpaRepository<Settings, Integer> {

    Optional<Settings> findByUserId(Integer userId);
}
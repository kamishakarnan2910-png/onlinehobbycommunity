package com.hobbycommunity.service;

import com.hobbycommunity.entity.Settings;
import com.hobbycommunity.repository.SettingsRepository;
import org.springframework.stereotype.Service;

@Service
public class SettingsService {

    private final SettingsRepository settingsRepository;

    public SettingsService(SettingsRepository settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    public Settings getSettings(Integer userId) {

        return settingsRepository.findByUserId(userId)
                .orElseGet(() -> {

                    Settings settings = new Settings();

                    settings.setUserId(userId);
                    settings.setEmailNotifications(true);
                    settings.setPushNotifications(true);
                    settings.setDarkMode(false);

                    return settingsRepository.save(settings);
                });
    }

    public Settings updateSettings(Settings settings) {
        return settingsRepository.save(settings);
    }
}
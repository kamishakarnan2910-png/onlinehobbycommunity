package com.hobbycommunity.service;

import com.hobbycommunity.entity.UserSettings;
import com.hobbycommunity.repository.UserSettingsRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserSettingsService {

    private final UserSettingsRepository repository;

    public UserSettingsService(
            UserSettingsRepository repository) {

        this.repository = repository;
    }

    public UserSettings getSettings(Integer userId) {

        Optional<UserSettings> existing =
                repository.findByUserId(userId);

        if (existing.isPresent()) {
            return existing.get();
        }

        UserSettings settings =
                new UserSettings();

        settings.setUserId(userId);
        settings.setCommunityNotifications(true);
        settings.setPostNotifications(true);
        settings.setTheme("light");

        return repository.save(settings);
    }

    public UserSettings saveSettings(
            UserSettings settings) {

        Optional<UserSettings> existing =
                repository.findByUserId(
                        settings.getUserId()
                );

        if (existing.isPresent()) {

            UserSettings oldSettings =
                    existing.get();

            if (settings.getCommunityNotifications()
                    != null) {

                oldSettings.setCommunityNotifications(
                        settings.getCommunityNotifications()
                );
            }

            if (settings.getPostNotifications()
                    != null) {

                oldSettings.setPostNotifications(
                        settings.getPostNotifications()
                );
            }

            if (settings.getTheme() != null &&
                    !settings.getTheme().isBlank()) {

                oldSettings.setTheme(
                        settings.getTheme()
                );
            }

            return repository.save(oldSettings);
        }

        if (settings.getCommunityNotifications()
                == null) {

            settings.setCommunityNotifications(true);
        }

        if (settings.getPostNotifications()
                == null) {

            settings.setPostNotifications(true);
        }

        if (settings.getTheme() == null ||
                settings.getTheme().isBlank()) {

            settings.setTheme("light");
        }

        return repository.save(settings);
    }
}
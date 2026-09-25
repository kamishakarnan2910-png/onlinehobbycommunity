package com.hobbycommunity.controller;

import com.hobbycommunity.entity.UserSettings;
import com.hobbycommunity.service.UserSettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class UserSettingsController {

    private final UserSettingsService userSettingsService;

    public UserSettingsController(
            UserSettingsService userSettingsService) {

        this.userSettingsService =
                userSettingsService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserSettings> getSettings(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(
                userSettingsService.getSettings(userId)
        );
    }

    @PostMapping
    public ResponseEntity<UserSettings> saveSettings(
            @RequestBody UserSettings settings) {

        if (settings.getUserId() == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(
                userSettingsService.saveSettings(
                        settings
                )
        );
    }
}
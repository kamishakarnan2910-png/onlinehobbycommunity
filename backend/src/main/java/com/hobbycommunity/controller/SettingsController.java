package com.hobbycommunity.controller;

import com.hobbycommunity.entity.Settings;
import com.hobbycommunity.service.SettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Settings> getSettings(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(
                settingsService.getSettings(userId)
        );
    }

    @PutMapping
    public ResponseEntity<Settings> updateSettings(
            @RequestBody Settings settings) {

        return ResponseEntity.ok(
                settingsService.updateSettings(settings)
        );
    }
}
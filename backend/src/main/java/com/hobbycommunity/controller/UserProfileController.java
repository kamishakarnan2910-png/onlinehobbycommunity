package com.hobbycommunity.controller;

import com.hobbycommunity.entity.UserProfile;
import com.hobbycommunity.service.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "*")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(
            UserProfileService userProfileService) {

        this.userProfileService = userProfileService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfile> getProfile(
            @PathVariable Integer userId) {

        return userProfileService.getProfile(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserProfile> saveProfile(
            @RequestBody UserProfile profile) {

        return ResponseEntity.ok(
                userProfileService.saveProfile(profile)
        );
    }
}
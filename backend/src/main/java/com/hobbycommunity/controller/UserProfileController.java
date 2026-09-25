package com.hobbycommunity.controller;

import com.hobbycommunity.entity.User;
import com.hobbycommunity.entity.UserProfile;
import com.hobbycommunity.service.UserProfileService;
import com.hobbycommunity.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "*")
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final UserService userService;

    public UserProfileController(
            UserProfileService userProfileService,
            UserService userService) {

        this.userProfileService = userProfileService;
        this.userService = userService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfile> getProfile(
            @PathVariable Integer userId,
            @RequestParam(required = false) Integer viewerId) {

        Optional<UserProfile> profile =
                userProfileService.getProfile(userId);

        if (profile.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        UserProfile userProfile = profile.get();

        if (userProfile.getPublicProfile() == null) {
            userProfile.setPublicProfile(true);
        }

        boolean isOwnProfile =
                viewerId != null &&
                viewerId.equals(userId);

        boolean isAdmin = false;

        if (viewerId != null) {

            Optional<User> viewer =
                    userService.getUserById(viewerId);

            if (viewer.isPresent()) {

                isAdmin =
                        "ADMIN".equalsIgnoreCase(
                                viewer.get().getRole()
                        );
            }
        }

        if (!userProfile.getPublicProfile()
                && !isOwnProfile
                && !isAdmin) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .build();
        }

        return ResponseEntity.ok(userProfile);
    }

    @PostMapping
    public ResponseEntity<UserProfile> saveProfile(
            @RequestBody UserProfile profile) {

        return ResponseEntity.ok(
                userProfileService.saveProfile(profile)
        );
    }
}
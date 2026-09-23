package com.hobbycommunity.service;

import com.hobbycommunity.entity.UserProfile;
import com.hobbycommunity.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;

    public UserProfileService(
            UserProfileRepository userProfileRepository) {

        this.userProfileRepository = userProfileRepository;
    }

    public Optional<UserProfile> getProfile(Integer userId) {

        return userProfileRepository.findByUserId(userId);
    }

    public UserProfile saveProfile(UserProfile profile) {

        Optional<UserProfile> existing =
                userProfileRepository.findByUserId(
                        profile.getUserId()
                );

        if (existing.isPresent()) {

            UserProfile oldProfile =
                    existing.get();

            oldProfile.setBio(profile.getBio());
            oldProfile.setLocation(
                    profile.getLocation()
            );
            oldProfile.setProfilePicture(
                    profile.getProfilePicture()
            );

            return userProfileRepository.save(
                    oldProfile
            );
        }

        return userProfileRepository.save(profile);
    }
}
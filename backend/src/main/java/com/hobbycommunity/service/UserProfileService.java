package com.hobbycommunity.service;

import com.hobbycommunity.entity.User;
import com.hobbycommunity.entity.UserProfile;
import com.hobbycommunity.repository.UserProfileRepository;
import com.hobbycommunity.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public UserProfileService(
            UserProfileRepository userProfileRepository,
            UserRepository userRepository) {

        this.userProfileRepository = userProfileRepository;
        this.userRepository = userRepository;
    }

    public Optional<UserProfile> getProfile(Integer userId) {

        return userProfileRepository.findByUserId(userId);
    }

    public UserProfile saveProfile(UserProfile profile) {

        Optional<UserProfile> existing =
                userProfileRepository.findByUserId(
                        profile.getUserId()
                );

        UserProfile savedProfile;

        if (existing.isPresent()) {

            UserProfile oldProfile = existing.get();

            oldProfile.setName(profile.getName());
            oldProfile.setUsername(profile.getUsername());
            oldProfile.setEducation(profile.getEducation());
            oldProfile.setBio(profile.getBio());
            oldProfile.setLocation(profile.getLocation());
            oldProfile.setProfilePicture(
                    profile.getProfilePicture()
            );

            if (profile.getPublicProfile() != null) {
                oldProfile.setPublicProfile(
                        profile.getPublicProfile()
                );
            }

            savedProfile =
                    userProfileRepository.save(oldProfile);

        } else {

            if (profile.getPublicProfile() == null) {
                profile.setPublicProfile(true);
            }

            savedProfile =
                    userProfileRepository.save(profile);
        }

        if (profile.getName() != null &&
                !profile.getName().isBlank()) {

            Optional<User> user =
                    userRepository.findById(
                            profile.getUserId()
                    );

            if (user.isPresent()) {

                User existingUser = user.get();

                existingUser.setName(
                        profile.getName()
                );

                userRepository.save(existingUser);
            }
        }

        return savedProfile;
    }
}
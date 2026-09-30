package com.hobbycommunity.service;

import com.hobbycommunity.entity.Follow;
import com.hobbycommunity.entity.UserProfile;
import com.hobbycommunity.repository.FollowRepository;
import com.hobbycommunity.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FollowService {

    private final FollowRepository followRepository;
    private final UserProfileRepository userProfileRepository;
    private final NotificationService notificationService;

    public FollowService(
            FollowRepository followRepository,
            UserProfileRepository userProfileRepository,
            NotificationService notificationService) {

        this.followRepository = followRepository;
        this.userProfileRepository = userProfileRepository;
        this.notificationService = notificationService;
    }

    public Follow follow(
            Integer followerId,
            Integer followingId) {

        if (followerId == null ||
                followingId == null) {

            throw new RuntimeException(
                    "User information is missing."
            );
        }

        if (followerId.equals(followingId)) {

            throw new RuntimeException(
                    "You cannot follow yourself."
            );
        }

        UserProfile targetProfile =
                userProfileRepository
                        .findByUserId(followingId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Profile not found."
                                )
                        );

        var existing =
                followRepository
                        .findByFollowerIdAndFollowingId(
                                followerId,
                                followingId
                        );

        if (existing.isPresent()) {

            Follow follow = existing.get();

            if ("ACCEPTED".equalsIgnoreCase(
                    follow.getStatus())) {

                return follow;
            }

            if ("PENDING".equalsIgnoreCase(
                    follow.getStatus())) {

                return follow;
            }

            if ("REJECTED".equalsIgnoreCase(
                    follow.getStatus())) {

                if (Boolean.TRUE.equals(
                        targetProfile.getPublicProfile())) {

                    follow.setStatus("ACCEPTED");

                    Follow saved =
                            followRepository.save(follow);

                    notificationService
                            .notifyNewFollower(
                                    followerId,
                                    followingId
                            );

                    return saved;

                } else {

                    follow.setStatus("PENDING");

                    Follow saved =
                            followRepository.save(follow);

                    notificationService
                            .notifyFollowRequest(
                                    followerId,
                                    followingId
                            );

                    return saved;
                }
            }
        }

        Follow follow = new Follow();

        follow.setFollowerId(
                followerId
        );

        follow.setFollowingId(
                followingId
        );

        if (Boolean.TRUE.equals(
                targetProfile.getPublicProfile())) {

            follow.setStatus("ACCEPTED");

            Follow saved =
                    followRepository.save(follow);

            notificationService
                    .notifyNewFollower(
                            followerId,
                            followingId
                    );

            return saved;

        } else {

            follow.setStatus("PENDING");

            Follow saved =
                    followRepository.save(follow);

            notificationService
                    .notifyFollowRequest(
                            followerId,
                            followingId
                    );

            return saved;
        }
    }

    public void unfollow(
            Integer followerId,
            Integer followingId) {

        followRepository
                .findByFollowerIdAndFollowingId(
                        followerId,
                        followingId
                )
                .ifPresent(
                        followRepository::delete
                );
    }

    public boolean isFollowing(
            Integer followerId,
            Integer followingId) {

        return followRepository
                .existsByFollowerIdAndFollowingIdAndStatus(
                        followerId,
                        followingId,
                        "ACCEPTED"
                );
    }

    public boolean isPending(
            Integer followerId,
            Integer followingId) {

        return followRepository
                .existsByFollowerIdAndFollowingIdAndStatus(
                        followerId,
                        followingId,
                        "PENDING"
                );
    }

    public long getFollowersCount(
            Integer userId) {

        return followRepository
                .countByFollowingIdAndStatus(
                        userId,
                        "ACCEPTED"
                );
    }

    public long getFollowingCount(
            Integer userId) {

        return followRepository
                .countByFollowerIdAndStatus(
                        userId,
                        "ACCEPTED"
                );
    }

    public List<Follow> getFollowers(
            Integer userId) {

        return followRepository
                .findByFollowingIdAndStatus(
                        userId,
                        "ACCEPTED"
                );
    }

    public List<Follow> getFollowing(
            Integer userId) {

        return followRepository
                .findByFollowerIdAndStatus(
                        userId,
                        "ACCEPTED"
                );
    }

    public List<Follow> getPendingRequests(
            Integer userId) {

        return followRepository
                .findByFollowingIdAndStatus(
                        userId,
                        "PENDING"
                );
    }

    public void acceptRequest(
            Integer requestId,
            Integer ownerId) {

        Follow follow =
                followRepository
                        .findById(requestId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Follow request not found."
                                )
                        );

        if (!follow.getFollowingId()
                .equals(ownerId)) {

            throw new RuntimeException(
                    "You cannot accept this request."
            );
        }

        if (!"PENDING".equalsIgnoreCase(
                follow.getStatus())) {

            throw new RuntimeException(
                    "This request is no longer pending."
            );
        }

        follow.setStatus("ACCEPTED");

        followRepository.save(follow);

        notificationService
                .notifyFollowAccepted(
                        ownerId,
                        follow.getFollowerId()
                );
    }

    public void rejectRequest(
            Integer requestId,
            Integer ownerId) {

        Follow follow =
                followRepository
                        .findById(requestId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Follow request not found."
                                )
                        );

        if (!follow.getFollowingId()
                .equals(ownerId)) {

            throw new RuntimeException(
                    "You cannot reject this request."
            );
        }

        if (!"PENDING".equalsIgnoreCase(
                follow.getStatus())) {

            throw new RuntimeException(
                    "This request is no longer pending."
            );
        }

        followRepository.delete(follow);
    }
}
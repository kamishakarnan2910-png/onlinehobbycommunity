package com.hobbycommunity.controller;

import com.hobbycommunity.entity.Follow;
import com.hobbycommunity.service.FollowService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/follows")
@CrossOrigin(origins = "*")
public class FollowController {

    private final FollowService followService;

    public FollowController(FollowService followService) {
        this.followService = followService;
    }

    @PostMapping
    public ResponseEntity<?> follow(
            @RequestParam Integer followerId,
            @RequestParam Integer followingId) {

        try {
            Follow follow =
                    followService.follow(
                            followerId,
                            followingId
                    );

            return ResponseEntity.ok(follow);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @DeleteMapping
    public ResponseEntity<?> unfollow(
            @RequestParam Integer followerId,
            @RequestParam Integer followingId) {

        try {

            followService.unfollow(
                    followerId,
                    followingId
            );

            return ResponseEntity
                    .noContent()
                    .build();

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> getStatus(
            @RequestParam Integer followerId,
            @RequestParam Integer followingId) {

        boolean following =
                followService.isFollowing(
                        followerId,
                        followingId
                );

        boolean pending =
                followService.isPending(
                        followerId,
                        followingId
                );

        return ResponseEntity.ok(
                Map.of(
                        "following",
                        following,
                        "pending",
                        pending
                )
        );
    }

    @GetMapping("/{userId}/followers/count")
    public ResponseEntity<Long> getFollowersCount(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(
                followService.getFollowersCount(
                        userId
                )
        );
    }

    @GetMapping("/{userId}/following/count")
    public ResponseEntity<Long> getFollowingCount(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(
                followService.getFollowingCount(
                        userId
                )
        );
    }

    @GetMapping("/{userId}/followers")
    public ResponseEntity<List<Follow>> getFollowers(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(
                followService.getFollowers(
                        userId
                )
        );
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<List<Follow>> getFollowing(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(
                followService.getFollowing(
                        userId
                )
        );
    }

    @GetMapping("/{userId}/requests")
    public ResponseEntity<List<Follow>> getPendingRequests(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(
                followService.getPendingRequests(
                        userId
                )
        );
    }

    @PutMapping("/{requestId}/accept")
    public ResponseEntity<?> acceptRequest(
            @PathVariable Integer requestId,
            @RequestParam Integer ownerId) {

        try {

            followService.acceptRequest(
                    requestId,
                    ownerId
            );

            return ResponseEntity.ok(
                    "Follow request accepted."
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{requestId}/reject")
    public ResponseEntity<?> rejectRequest(
            @PathVariable Integer requestId,
            @RequestParam Integer ownerId) {

        try {

            followService.rejectRequest(
                    requestId,
                    ownerId
            );

            return ResponseEntity
                    .noContent()
                    .build();

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}
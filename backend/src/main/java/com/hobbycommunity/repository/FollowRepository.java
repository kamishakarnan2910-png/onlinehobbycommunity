package com.hobbycommunity.repository;

import com.hobbycommunity.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FollowRepository
        extends JpaRepository<Follow, Integer> {

    Optional<Follow> findByFollowerIdAndFollowingId(
            Integer followerId,
            Integer followingId
    );

    List<Follow> findByFollowingIdAndStatus(
            Integer followingId,
            String status
    );

    List<Follow> findByFollowerIdAndStatus(
            Integer followerId,
            String status
    );

    long countByFollowingIdAndStatus(
            Integer followingId,
            String status
    );

    long countByFollowerIdAndStatus(
            Integer followerId,
            String status
    );

    boolean existsByFollowerIdAndFollowingIdAndStatus(
            Integer followerId,
            Integer followingId,
            String status
    );
}
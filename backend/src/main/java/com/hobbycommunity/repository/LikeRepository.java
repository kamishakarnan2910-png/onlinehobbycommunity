package com.hobbycommunity.repository;

import com.hobbycommunity.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Integer> {

    List<Like> findByPostId(Integer postId);

    Optional<Like> findByPostIdAndUserId(
            Integer postId,
            Integer userId
    );
}
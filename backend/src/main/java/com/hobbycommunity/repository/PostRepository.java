package com.hobbycommunity.repository;

import com.hobbycommunity.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Integer> {

    List<Post> findByCommunityIdOrderByCreatedAtDesc(Integer communityId);

}
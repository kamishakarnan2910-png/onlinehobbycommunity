package com.hobbycommunity.repository;

import com.hobbycommunity.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {

    List<Comment> findByPostIdOrderByCreatedAtDesc(Integer postId);

}
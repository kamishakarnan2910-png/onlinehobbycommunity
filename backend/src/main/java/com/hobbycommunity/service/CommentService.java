package com.hobbycommunity.service;

import com.hobbycommunity.entity.Comment;
import com.hobbycommunity.entity.Post;
import com.hobbycommunity.repository.CommentRepository;
import com.hobbycommunity.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final NotificationService notificationService;

    public CommentService(
            CommentRepository commentRepository,
            PostRepository postRepository,
            NotificationService notificationService) {

        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.notificationService = notificationService;
    }

    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    public List<Comment> getCommentsByPostId(Integer postId) {
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
    }

    public Comment addComment(Comment comment) {

        Comment savedComment =
                commentRepository.save(comment);

        Post post =
                postRepository.findById(comment.getPostId())
                        .orElse(null);

        if (post != null) {

            Integer postOwnerId =
                    post.getUserId();

            Integer commenterId =
                    comment.getUserId();

            if (
                    postOwnerId != null &&
                    commenterId != null &&
                    !postOwnerId.equals(commenterId)
            ) {

                notificationService.notifyPostComment(
                        commenterId,
                        postOwnerId
                );
            }
        }

        return savedComment;
    }
}
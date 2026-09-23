package com.hobbycommunity.controller;

import com.hobbycommunity.entity.Comment;
import com.hobbycommunity.service.CommentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public List<Comment> getAllComments() {
        return commentService.getAllComments();
    }

    @GetMapping("/post/{postId}")
    public List<Comment> getCommentsByPostId(
            @PathVariable Integer postId) {

        return commentService.getCommentsByPostId(postId);
    }

    @PostMapping
    public Comment addComment(@RequestBody Comment comment) {
        return commentService.addComment(comment);
    }
}
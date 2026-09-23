package com.hobbycommunity.controller;

import com.hobbycommunity.entity.Post;
import com.hobbycommunity.service.PostService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/community/{communityId}")
    public List<Post> getPostsByCommunityId(
            @PathVariable Integer communityId) {

        return postService.getPostsByCommunityId(communityId);
    }

    @PostMapping
    public Post createPost(@RequestBody Post post) {
        return postService.createPost(post);
    }
}
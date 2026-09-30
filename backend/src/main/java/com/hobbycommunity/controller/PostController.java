package com.hobbycommunity.controller;

import com.hobbycommunity.dto.PostResponse;
import com.hobbycommunity.entity.Post;
import com.hobbycommunity.service.PostService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    private final PostService postService;

    public PostController(
            PostService postService) {

        this.postService = postService;
    }


    // ========================================
    // GET ALL POSTS
    // ========================================

    @GetMapping
    public List<PostResponse> getAllPosts() {

        return postService.getAllPosts();
    }


    // ========================================
    // GET POSTS BY COMMUNITY
    // ========================================

    @GetMapping("/community/{communityId}")
    public List<PostResponse> getPostsByCommunityId(
            @PathVariable Integer communityId) {

        return postService.getPostsByCommunityId(
                communityId
        );
    }


    // ========================================
    // CREATE POST - MULTIPLE IMAGES
    // ========================================

    @PostMapping(
            consumes = "multipart/form-data"
    )
    public ResponseEntity<Post> createPost(

            @RequestParam String title,

            @RequestParam String content,

            @RequestParam String category,

            @RequestParam Integer userId,

            @RequestParam Integer communityId,

            @RequestPart(
                    value = "images",
                    required = false
            )
            List<MultipartFile> images
    ) {

        Post post = new Post();

        post.setTitle(title);

        post.setContent(content);

        post.setCategory(category);

        post.setUserId(userId);

        post.setCommunityId(communityId);


        Post savedPost =
                postService.createPost(
                        post,
                        images
                );


        return ResponseEntity.ok(
                savedPost
        );
    }


    // ========================================
    // DELETE POST - OWNER ONLY
    // ========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(

            @PathVariable Integer id,

            @RequestParam Integer userId
    ) {

        postService.deletePost(
                id,
                userId
        );


        return ResponseEntity
                .noContent()
                .build();
    }
}
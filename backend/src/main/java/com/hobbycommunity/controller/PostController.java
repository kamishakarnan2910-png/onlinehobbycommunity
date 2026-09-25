package com.hobbycommunity.controller;

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

        return postService.getPostsByCommunityId(
                communityId
        );
    }


    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Post> createPost(

            @RequestParam String title,

            @RequestParam String content,

            @RequestParam String category,

            @RequestParam Integer userId,

            @RequestParam Integer communityId,

            @RequestPart(
                    value = "image",
                    required = false
            )
            MultipartFile image

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
                        image
                );


        return ResponseEntity.ok(
                savedPost
        );
    }


    @DeleteMapping("/{id}")
    public void deletePost(
            @PathVariable Integer id) {

        postService.deletePost(id);
    }
}
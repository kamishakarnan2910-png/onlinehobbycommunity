package com.hobbycommunity.controller;

import com.hobbycommunity.entity.Like;
import com.hobbycommunity.service.LikeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/likes")
@CrossOrigin(origins = "*")
public class LikeController {

    private final LikeService likeService;

    public LikeController(
            LikeService likeService) {

        this.likeService =
                likeService;
    }

    @GetMapping
    public List<Like> getAllLikes() {

        return likeService.getAllLikes();
    }

    @GetMapping("/post/{postId}/count")
    public long getLikeCount(
            @PathVariable Integer postId) {

        return likeService.getLikeCount(
                postId
        );
    }

    /*
     * Like / Unlike
     */
    @PostMapping
    public ResponseEntity<?> toggleLike(
            @RequestBody Like like) {

        Like result =
                likeService.toggleLike(
                        like
                );

        if (result == null) {

            return ResponseEntity.ok(
                    "Post unliked successfully"
            );
        }

        return ResponseEntity.ok(
                result
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeLike(
            @PathVariable Integer id) {

        likeService.removeLike(id);

        return ResponseEntity.noContent()
                .build();
    }
}
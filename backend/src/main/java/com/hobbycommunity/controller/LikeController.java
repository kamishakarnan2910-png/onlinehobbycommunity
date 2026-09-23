package com.hobbycommunity.controller;

import com.hobbycommunity.entity.Like;
import com.hobbycommunity.service.LikeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/likes")
@CrossOrigin(origins = "*")
public class LikeController {

    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @GetMapping
    public List<Like> getAllLikes() {
        return likeService.getAllLikes();
    }

    @GetMapping("/post/{postId}/count")
    public long getLikeCount(
            @PathVariable Integer postId) {

        return likeService.getLikeCount(postId);
    }

    @PostMapping
    public Like addLike(@RequestBody Like like) {
        return likeService.addLike(like);
    }

    @DeleteMapping("/{id}")
    public void removeLike(@PathVariable Integer id) {
        likeService.removeLike(id);
    }
}
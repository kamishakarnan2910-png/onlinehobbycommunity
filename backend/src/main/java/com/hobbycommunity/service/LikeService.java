package com.hobbycommunity.service;

import com.hobbycommunity.entity.Like;
import com.hobbycommunity.repository.LikeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LikeService {

    private final LikeRepository likeRepository;

    public LikeService(LikeRepository likeRepository) {
        this.likeRepository = likeRepository;
    }

    public List<Like> getAllLikes() {
        return likeRepository.findAll();
    }

    public Like addLike(Like like) {

        Like existingLike =
                likeRepository
                        .findByPostIdAndUserId(
                                like.getPostId(),
                                like.getUserId()
                        )
                        .orElse(null);

        if (existingLike != null) {
            return existingLike;
        }

        return likeRepository.save(like);
    }

    public long getLikeCount(Integer postId) {
        return likeRepository
                .findByPostId(postId)
                .size();
    }

    public void removeLike(Integer id) {
        likeRepository.deleteById(id);
    }
}
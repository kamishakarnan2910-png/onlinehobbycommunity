package com.hobbycommunity.service;

import com.hobbycommunity.entity.Like;
import com.hobbycommunity.entity.Post;
import com.hobbycommunity.repository.LikeRepository;
import com.hobbycommunity.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final NotificationService notificationService;

    public LikeService(
            LikeRepository likeRepository,
            PostRepository postRepository,
            NotificationService notificationService) {

        this.likeRepository =
                likeRepository;

        this.postRepository =
                postRepository;

        this.notificationService =
                notificationService;
    }

    public List<Like> getAllLikes() {

        return likeRepository.findAll();
    }

    public Like toggleLike(Like like) {

        Like existingLike =
                likeRepository
                        .findByPostIdAndUserId(
                                like.getPostId(),
                                like.getUserId()
                        )
                        .orElse(null);

        if (existingLike != null) {

            likeRepository.delete(
                    existingLike
            );

            return null;
        }

        Like savedLike =
                likeRepository.save(like);

        Post post =
                postRepository.findById(
                        like.getPostId()
                ).orElse(null);

        if (post != null) {

            Integer postOwnerId =
                    post.getUserId();

            Integer likerId =
                    like.getUserId();

            if (
                    postOwnerId != null &&
                    likerId != null &&
                    !postOwnerId.equals(likerId)
            ) {

                notificationService.notifyPostLike(
                        likerId,
                        postOwnerId
                );
            }
        }

        return savedLike;
    }

    public long getLikeCount(
            Integer postId) {

        return likeRepository
                .findByPostId(postId)
                .size();
    }

    public void removeLike(
            Integer id) {

        likeRepository.deleteById(id);
    }
}
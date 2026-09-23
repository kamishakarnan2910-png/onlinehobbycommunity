package com.hobbycommunity.service;

import com.hobbycommunity.entity.Post;
import com.hobbycommunity.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public List<Post> getPostsByCommunityId(Integer communityId) {
        return postRepository.findByCommunityIdOrderByCreatedAtDesc(communityId);
    }

    public Post createPost(Post post) {
        return postRepository.save(post);
    }
}
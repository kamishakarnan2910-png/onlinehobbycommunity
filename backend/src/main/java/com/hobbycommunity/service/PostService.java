package com.hobbycommunity.service;

import com.hobbycommunity.entity.Post;
import com.hobbycommunity.repository.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class PostService {

    private final PostRepository postRepository;

    @PersistenceContext
    private EntityManager entityManager;

    private final Path uploadDirectory =
            Paths.get("uploads").toAbsolutePath().normalize();

    public PostService(PostRepository postRepository) {

        this.postRepository = postRepository;

        try {
            Files.createDirectories(uploadDirectory);
        } catch (IOException e) {
            throw new RuntimeException(
                    "Unable to create upload directory.",
                    e
            );
        }
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public List<Post> getPostsByCommunityId(Integer communityId) {

        return postRepository
                .findByCommunityIdOrderByCreatedAtDesc(
                        communityId
                );
    }

    public Post createPost(
            Post post,
            MultipartFile image
    ) {

        if (image != null && !image.isEmpty()) {

            String contentType =
                    image.getContentType();

            if (
                    contentType == null ||
                    !contentType.startsWith("image/")
            ) {

                throw new IllegalArgumentException(
                        "Only image files are allowed."
                );
            }


            if (image.getSize() > 5 * 1024 * 1024) {

                throw new IllegalArgumentException(
                        "Image size must be less than 5 MB."
                );
            }


            String originalName =
                    image.getOriginalFilename();


            String extension = "";

            if (
                    originalName != null &&
                    originalName.contains(".")
            ) {

                extension =
                        originalName.substring(
                                originalName.lastIndexOf(".")
                        );
            }


            String fileName =
                    UUID.randomUUID()
                    + extension;


            Path filePath =
                    uploadDirectory.resolve(fileName);


            try {

                Files.copy(
                        image.getInputStream(),
                        filePath,
                        StandardCopyOption.REPLACE_EXISTING
                );

            } catch (IOException e) {

                throw new RuntimeException(
                        "Unable to save image.",
                        e
                );
            }


            post.setImageUrl(
                    "/uploads/" + fileName
            );
        }


        return postRepository.save(post);
    }

    @Transactional
    public void deletePost(Integer id) {

        entityManager.createNativeQuery(
                "DELETE FROM comments WHERE post_id = :postId"
        )
        .setParameter("postId", id)
        .executeUpdate();


        entityManager.createNativeQuery(
                "DELETE FROM likes WHERE post_id = :postId"
        )
        .setParameter("postId", id)
        .executeUpdate();


        postRepository.deleteById(id);
    }
}
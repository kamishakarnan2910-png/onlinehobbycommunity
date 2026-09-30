package com.hobbycommunity.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hobbycommunity.dto.PostResponse;
import com.hobbycommunity.entity.CommunityMember;
import com.hobbycommunity.entity.Post;
import com.hobbycommunity.entity.User;
import com.hobbycommunity.repository.CommunityMemberRepository;
import com.hobbycommunity.repository.PostRepository;
import com.hobbycommunity.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommunityMemberRepository communityMemberRepository;
    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    @PersistenceContext
    private EntityManager entityManager;

    private final Path uploadDirectory =
            Paths.get("uploads")
                    .toAbsolutePath()
                    .normalize();

    public PostService(
            PostRepository postRepository,
            UserRepository userRepository,
            CommunityMemberRepository communityMemberRepository,
            NotificationService notificationService,
            ObjectMapper objectMapper) {

        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.communityMemberRepository =
                communityMemberRepository;
        this.notificationService =
                notificationService;
        this.objectMapper = objectMapper;

        try {
            Files.createDirectories(
                    uploadDirectory
            );
        } catch (IOException e) {
            throw new RuntimeException(
                    "Unable to create upload directory.",
                    e
            );
        }
    }

    public List<PostResponse> getAllPosts() {

        return postRepository
                .findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<PostResponse> getPostsByCommunityId(
            Integer communityId) {

        return postRepository
                .findByCommunityIdOrderByCreatedAtDesc(
                        communityId
                )
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public Post createPost(
            Post post,
            List<MultipartFile> images) {

        List<String> imageUrls =
                new ArrayList<>();

        if (
                images != null &&
                !images.isEmpty()
        ) {

            for (MultipartFile image : images) {

                if (
                        image == null ||
                        image.isEmpty()
                ) {
                    continue;
                }

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

                if (
                        image.getSize() >
                        5 * 1024 * 1024
                ) {
                    throw new IllegalArgumentException(
                            "Each image must be less than 5 MB."
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
                        uploadDirectory.resolve(
                                fileName
                        );

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

                imageUrls.add(
                        "/uploads/" + fileName
                );
            }
        }

        if (!imageUrls.isEmpty()) {

            post.setImageUrl(
                    imageUrls.get(0)
            );

            try {

                post.setImageUrls(
                        objectMapper.writeValueAsString(
                                imageUrls
                        )
                );

            } catch (Exception e) {

                throw new RuntimeException(
                        "Unable to save image information.",
                        e
                );
            }
        }

        Post savedPost =
                postRepository.save(post);

        notifyCommunityMembers(
                savedPost
        );

        return savedPost;
    }

    private void notifyCommunityMembers(
            Post post) {

        Integer communityId =
                post.getCommunityId();

        Integer posterId =
                post.getUserId();

        if (communityId == null ||
                posterId == null) {
            return;
        }

        List<CommunityMember> members =
                communityMemberRepository
                        .findByCommunityId(
                                communityId
                        );

        for (CommunityMember member : members) {

            Integer memberUserId =
                    member.getUserId();

            if (
                    memberUserId == null ||
                    memberUserId.equals(posterId)
            ) {
                continue;
            }

            notificationService
                    .notifyNewPost(
                            posterId,
                            memberUserId
                    );
        }
    }

    @Transactional
    public void deletePost(
            Integer postId,
            Integer userId) {

        Post post =
                postRepository
                        .findById(postId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Post not found."
                                )
                        );

        if (
                post.getUserId() == null ||
                userId == null ||
                !post.getUserId()
                        .equals(userId)
        ) {

            throw new RuntimeException(
                    "Only the post owner can delete this post."
            );
        }

        entityManager
                .createNativeQuery(
                        "DELETE FROM comments " +
                        "WHERE post_id = :postId"
                )
                .setParameter(
                        "postId",
                        postId
                )
                .executeUpdate();

        entityManager
                .createNativeQuery(
                        "DELETE FROM likes " +
                        "WHERE post_id = :postId"
                )
                .setParameter(
                        "postId",
                        postId
                )
                .executeUpdate();

        List<String> imageUrls =
                getImageUrls(post);

        for (String imageUrl : imageUrls) {

            deleteUploadedImage(
                    imageUrl
            );
        }

        postRepository.delete(post);
    }

    private PostResponse convertToResponse(
            Post post) {

        PostResponse response =
                new PostResponse();

        response.setId(
                post.getId()
        );

        response.setTitle(
                post.getTitle()
        );

        response.setContent(
                post.getContent()
        );

        response.setCategory(
                post.getCategory()
        );

        response.setImageUrl(
                post.getImageUrl()
        );

        response.setImageUrls(
                getImageUrls(post)
        );

        response.setUserId(
                post.getUserId()
        );

        response.setCommunityId(
                post.getCommunityId()
        );

        response.setCreatedAt(
                post.getCreatedAt()
        );

        if (post.getUserId() != null) {

            User user =
                    userRepository
                            .findById(
                                    post.getUserId()
                            )
                            .orElse(null);

            if (user != null) {

                response.setUserName(
                        user.getName()
                );

            } else {

                response.setUserName(
                        "User"
                );
            }

        } else {

            response.setUserName(
                    "User"
            );
        }

        return response;
    }

    private List<String> getImageUrls(
            Post post) {

        List<String> imageUrls =
                new ArrayList<>();

        String storedImageUrls =
                post.getImageUrls();

        if (
                storedImageUrls != null &&
                !storedImageUrls.isBlank()
        ) {

            try {

                imageUrls =
                        objectMapper.readValue(
                                storedImageUrls,
                                new TypeReference<List<String>>() {}
                        );

            } catch (Exception e) {

                System.out.println(
                        "Unable to read image URLs: "
                                + e.getMessage()
                );
            }
        }

        if (
                imageUrls.isEmpty() &&
                post.getImageUrl() != null &&
                !post.getImageUrl().isBlank()
        ) {

            imageUrls.add(
                    post.getImageUrl()
            );
        }

        return imageUrls;
    }

    private void deleteUploadedImage(
            String imageUrl) {

        if (
                imageUrl == null ||
                !imageUrl.startsWith("/uploads/")
        ) {
            return;
        }

        String fileName =
                imageUrl.substring(
                        "/uploads/".length()
                );

        Path imagePath =
                uploadDirectory.resolve(
                        fileName
                );

        try {

            Files.deleteIfExists(
                    imagePath
            );

        } catch (IOException e) {

            System.out.println(
                    "Unable to delete post image: "
                            + e.getMessage()
            );
        }
    }
}
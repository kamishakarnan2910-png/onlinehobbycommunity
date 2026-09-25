package com.hobbycommunity.service;

import com.hobbycommunity.entity.Community;
import com.hobbycommunity.repository.CommunityRepository;
import com.hobbycommunity.repository.CommunityMemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final CommunityMemberRepository communityMemberRepository;

    private final Path uploadDirectory =
            Paths.get("uploads");


    public CommunityService(
            CommunityRepository communityRepository,
            CommunityMemberRepository communityMemberRepository) {

        this.communityRepository =
                communityRepository;

        this.communityMemberRepository =
                communityMemberRepository;
    }


    /* =========================
       GET ALL COMMUNITIES
    ========================= */

    public List<Community> getAllCommunities() {

        return communityRepository.findAll();
    }


    /* =========================
       GET COMMUNITY BY ID
    ========================= */

    public Community getCommunityById(
            Integer id) {

        return communityRepository
                .findById(id)
                .orElse(null);
    }


    /* =========================
       CREATE COMMUNITY
    ========================= */

    public Community createCommunity(
            Community community,
            MultipartFile image) {

        try {

            if (!Files.exists(uploadDirectory)) {

                Files.createDirectories(
                        uploadDirectory
                );
            }


            if (
                    image != null &&
                    !image.isEmpty()
            ) {

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
                                .toString()
                        + extension;


                Path filePath =
                        uploadDirectory
                                .resolve(fileName);


                Files.copy(
                        image.getInputStream(),
                        filePath,
                        StandardCopyOption.REPLACE_EXISTING
                );


                community.setImageUrl(
                        "/uploads/" + fileName
                );
            }


            return communityRepository.save(
                    community
            );

        } catch (IOException e) {

            throw new RuntimeException(
                    "Unable to upload community image",
                    e
            );
        }
    }


    /* =========================
       DELETE COMMUNITY
       CREATOR OR ADMIN ONLY
    ========================= */

    public void deleteCommunity(
            Integer communityId,
            Integer userId,
            String role) {


        Community community =
                communityRepository
                        .findById(communityId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Community not found"
                                )
                        );


        boolean isAdmin =
                role != null &&
                role.equalsIgnoreCase("ADMIN");


        boolean isCreator =
                userId != null &&
                community.getCreatedBy() != null &&
                community.getCreatedBy()
                        .equals(userId);


        if (!isAdmin && !isCreator) {

            throw new RuntimeException(
                    "You are not allowed to delete this community"
            );
        }


        /*
         * Delete uploaded community image
         */

        String imageUrl =
                community.getImageUrl();

        if (
                imageUrl != null &&
                imageUrl.startsWith("/uploads/")
        ) {

            try {

                String fileName =
                        imageUrl.substring(
                                "/uploads/".length()
                        );

                Path imagePath =
                        uploadDirectory.resolve(
                                fileName
                        );

                Files.deleteIfExists(
                        imagePath
                );

            } catch (IOException e) {

                System.out.println(
                        "Unable to delete community image: "
                        + e.getMessage()
                );
            }
        }


        /*
         * Delete community
         */

        communityRepository.delete(
                community
        );
    }


    /* =========================
       MEMBER COUNT
    ========================= */

    public long getMemberCount(
            Integer communityId) {

        return communityMemberRepository
                .countByCommunityId(
                        communityId
                );
    }
}
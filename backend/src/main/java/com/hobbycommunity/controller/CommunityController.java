package com.hobbycommunity.controller;

import com.hobbycommunity.entity.Community;
import com.hobbycommunity.service.CommunityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/communities")
@CrossOrigin(origins = "*")
public class CommunityController {

    private final CommunityService communityService;

    public CommunityController(
            CommunityService communityService) {

        this.communityService =
                communityService;
    }


    /* =========================
       GET ALL COMMUNITIES
    ========================= */

    @GetMapping
    public List<Community> getAllCommunities() {

        return communityService
                .getAllCommunities();
    }


    /* =========================
       GET COMMUNITY BY ID
    ========================= */

    @GetMapping("/{id}")
    public Community getCommunityById(
            @PathVariable Integer id) {

        return communityService
                .getCommunityById(id);
    }


    /* =========================
       CREATE COMMUNITY
    ========================= */

    @PostMapping(
            consumes = "multipart/form-data"
    )
    public ResponseEntity<Community> createCommunity(

            @RequestParam String name,

            @RequestParam String description,

            @RequestParam String category,

            @RequestParam Integer createdBy,

            @RequestPart(
                    value = "image",
                    required = false
            )
            MultipartFile image

    ) {

        Community community =
                new Community();

        community.setName(name);
        community.setDescription(description);
        community.setCategory(category);
        community.setCreatedBy(createdBy);

        Community savedCommunity =
                communityService.createCommunity(
                        community,
                        image
                );

        return ResponseEntity.ok(
                savedCommunity
        );
    }


    /* =========================
       DELETE COMMUNITY
       CREATOR OR ADMIN ONLY
    ========================= */

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommunity(

            @PathVariable Integer id,

            @RequestParam Integer userId,

            @RequestParam String role

    ) {

        communityService.deleteCommunity(
                id,
                userId,
                role
        );

        return ResponseEntity.noContent()
                .build();
    }


    /* =========================
       MEMBER COUNT
    ========================= */

    @GetMapping("/{id}/members/count")
    public long getMemberCount(
            @PathVariable Integer id) {

        return communityService
                .getMemberCount(id);
    }
}
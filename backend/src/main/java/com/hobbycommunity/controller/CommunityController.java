package com.hobbycommunity.controller;

import com.hobbycommunity.entity.Community;
import com.hobbycommunity.service.CommunityService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/communities")
@CrossOrigin(origins = "*")
public class CommunityController {

    private final CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @GetMapping
    public List<Community> getAllCommunities() {
        return communityService.getAllCommunities();
    }

    @GetMapping("/{id}")
    public Community getCommunityById(@PathVariable Integer id) {
        return communityService.getCommunityById(id);
    }

    @PostMapping
    public Community createCommunity(@RequestBody Community community) {
        return communityService.createCommunity(community);
    }

    @GetMapping("/{id}/members/count")
    public long getMemberCount(@PathVariable Integer id) {
        return communityService.getMemberCount(id);
    }
}
package com.hobbycommunity.controller;

import com.hobbycommunity.entity.CommunityMember;
import com.hobbycommunity.service.CommunityMemberService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/community-members")
@CrossOrigin(origins = "*")
public class CommunityMemberController {

    private final CommunityMemberService service;


    public CommunityMemberController(
            CommunityMemberService service) {

        this.service = service;
    }


    @PostMapping("/join")
    public CommunityMember joinCommunity(
            @RequestParam Integer communityId,
            @RequestParam Integer userId) {

        return service.joinCommunity(
                communityId,
                userId
        );
    }


    @GetMapping("/check")
    public boolean checkMembership(
            @RequestParam Integer communityId,
            @RequestParam Integer userId) {

        return service.isMember(
                communityId,
                userId
        );
    }


    @GetMapping("/user/{userId}")
    public List<CommunityMember> getUserCommunities(
            @PathVariable Integer userId) {

        return service.getUserCommunities(
                userId
        );
    }


    @GetMapping("/count/{communityId}")
    public long getMemberCount(
            @PathVariable Integer communityId) {

        return service.getMemberCount(
                communityId
        );
    }
}
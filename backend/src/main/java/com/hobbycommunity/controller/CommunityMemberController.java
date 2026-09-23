package com.hobbycommunity.controller;

import com.hobbycommunity.entity.CommunityMember;
import com.hobbycommunity.service.CommunityMemberService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/community-members")
@CrossOrigin(origins = "*")
public class CommunityMemberController {

    private final CommunityMemberService service;

    public CommunityMemberController(CommunityMemberService service) {
        this.service = service;
    }

    @PostMapping("/join")
    public CommunityMember joinCommunity(
            @RequestParam Integer communityId,
            @RequestParam Integer userId) {

        return service.joinCommunity(communityId, userId);
    }
}
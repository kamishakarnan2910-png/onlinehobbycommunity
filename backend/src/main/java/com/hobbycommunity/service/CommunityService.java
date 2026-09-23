package com.hobbycommunity.service;

import com.hobbycommunity.entity.Community;
import com.hobbycommunity.repository.CommunityRepository;
import com.hobbycommunity.repository.CommunityMemberRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final CommunityMemberRepository communityMemberRepository;

    public CommunityService(
            CommunityRepository communityRepository,
            CommunityMemberRepository communityMemberRepository) {

        this.communityRepository = communityRepository;
        this.communityMemberRepository = communityMemberRepository;
    }

    public List<Community> getAllCommunities() {
        return communityRepository.findAll();
    }

    public Community getCommunityById(Integer id) {
        return communityRepository.findById(id).orElse(null);
    }

    public Community createCommunity(Community community) {
        return communityRepository.save(community);
    }

    public long getMemberCount(Integer communityId) {
        return communityMemberRepository.countByCommunityId(communityId);
    }
}
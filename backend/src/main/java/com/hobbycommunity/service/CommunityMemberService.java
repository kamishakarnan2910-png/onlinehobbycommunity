package com.hobbycommunity.service;

import com.hobbycommunity.entity.CommunityMember;
import com.hobbycommunity.repository.CommunityMemberRepository;
import org.springframework.stereotype.Service;

@Service
public class CommunityMemberService {

    private final CommunityMemberRepository repository;

    public CommunityMemberService(CommunityMemberRepository repository) {
        this.repository = repository;
    }

    public CommunityMember joinCommunity(
            Integer communityId,
            Integer userId) {

        boolean alreadyJoined =
                repository.existsByCommunityIdAndUserId(
                        communityId,
                        userId
                );

        if (alreadyJoined) {

            return repository
                    .findAll()
                    .stream()
                    .filter(member ->
                            member.getCommunityId().equals(communityId)
                            && member.getUserId().equals(userId)
                    )
                    .findFirst()
                    .orElse(null);
        }

        CommunityMember member =
                new CommunityMember();

        member.setCommunityId(communityId);
        member.setUserId(userId);

        return repository.save(member);
    }
}
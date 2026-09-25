package com.hobbycommunity.service;

import com.hobbycommunity.entity.CommunityMember;
import com.hobbycommunity.repository.CommunityMemberRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommunityMemberService {

    private final CommunityMemberRepository repository;

    public CommunityMemberService(
            CommunityMemberRepository repository) {

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

            return repository.findByUserId(userId)
                    .stream()
                    .filter(member ->
                            member.getCommunityId()
                                    .equals(communityId))
                    .findFirst()
                    .orElse(null);
        }


        CommunityMember member =
                new CommunityMember();

        member.setCommunityId(communityId);

        member.setUserId(userId);


        return repository.save(member);
    }


    public boolean isMember(
            Integer communityId,
            Integer userId) {

        return repository.existsByCommunityIdAndUserId(
                communityId,
                userId
        );
    }


    public List<CommunityMember> getUserCommunities(
            Integer userId) {

        return repository.findByUserId(userId);
    }


    public long getMemberCount(
            Integer communityId) {

        return repository.countByCommunityId(
                communityId
        );
    }
}
package com.hobbycommunity.service;

import com.hobbycommunity.entity.Community;
import com.hobbycommunity.entity.CommunityMember;
import com.hobbycommunity.repository.CommunityMemberRepository;
import com.hobbycommunity.repository.CommunityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommunityMemberService {

    private final CommunityMemberRepository repository;
    private final CommunityRepository communityRepository;
    private final NotificationService notificationService;

    public CommunityMemberService(
            CommunityMemberRepository repository,
            CommunityRepository communityRepository,
            NotificationService notificationService) {

        this.repository = repository;
        this.communityRepository = communityRepository;
        this.notificationService = notificationService;
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

        Community community =
                communityRepository
                        .findById(communityId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Community not found."
                                )
                        );

        CommunityMember member =
                new CommunityMember();

        member.setCommunityId(
                communityId
        );

        member.setUserId(
                userId
        );

        CommunityMember savedMember =
                repository.save(member);

        Integer ownerId =
                community.getCreatedBy();

        if (ownerId != null &&
                !ownerId.equals(userId)) {

            notificationService
                    .notifyCommunityJoin(
                            userId,
                            ownerId
                    );
        }

        return savedMember;
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
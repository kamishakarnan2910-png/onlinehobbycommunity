package com.hobbycommunity.repository;

import com.hobbycommunity.entity.CommunityMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityMemberRepository
        extends JpaRepository<CommunityMember, Integer> {

    boolean existsByCommunityIdAndUserId(
            Integer communityId,
            Integer userId
    );

    long countByCommunityId(Integer communityId);

    List<CommunityMember> findByUserId(
            Integer userId
    );
}
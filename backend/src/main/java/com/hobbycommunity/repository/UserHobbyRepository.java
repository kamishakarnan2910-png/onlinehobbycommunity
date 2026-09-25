package com.hobbycommunity.repository;

import com.hobbycommunity.entity.UserHobby;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserHobbyRepository extends JpaRepository<UserHobby, Integer> {

    boolean existsByUserIdAndHobbyId(Integer userId, Integer hobbyId);

    List<UserHobby> findByUserId(Integer userId);

    long countByHobbyId(Integer hobbyId);
}

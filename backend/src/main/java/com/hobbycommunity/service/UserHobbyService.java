package com.hobbycommunity.service;

import com.hobbycommunity.entity.UserHobby;
import com.hobbycommunity.repository.UserHobbyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserHobbyService {

    private final UserHobbyRepository repository;

    public UserHobbyService(UserHobbyRepository repository) {
        this.repository = repository;
    }

    public UserHobby joinHobby(Integer userId, Integer hobbyId) {

        if (repository.existsByUserIdAndHobbyId(userId, hobbyId)) {
            return repository.findByUserId(userId)
                    .stream()
                    .filter(userHobby ->
                            userHobby.getHobbyId().equals(hobbyId))
                    .findFirst()
                    .orElse(null);
        }

        UserHobby userHobby = new UserHobby();
        userHobby.setUserId(userId);
        userHobby.setHobbyId(hobbyId);

        return repository.save(userHobby);
    }

    public List<UserHobby> getUserHobbies(Integer userId) {
        return repository.findByUserId(userId);
    }

    public long getHobbyMemberCount(Integer hobbyId) {
        return repository.countByHobbyId(hobbyId);
    }
}
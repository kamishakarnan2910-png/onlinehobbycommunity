package com.hobbycommunity.service;

import com.hobbycommunity.entity.Hobby;
import com.hobbycommunity.repository.HobbyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HobbyService {

    private final HobbyRepository hobbyRepository;

    public HobbyService(HobbyRepository hobbyRepository) {
        this.hobbyRepository = hobbyRepository;
    }

    public List<Hobby> getAllHobbies() {
        return hobbyRepository.findAll();
    }

    public Optional<Hobby> getHobbyById(Integer id) {
        return hobbyRepository.findById(id);
    }

    public Hobby createHobby(Hobby hobby) {
        return hobbyRepository.save(hobby);
    }

    public Hobby updateHobby(Integer id, Hobby hobbyDetails) {

        Hobby hobby = hobbyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hobby not found"));

        hobby.setName(hobbyDetails.getName());
        hobby.setDescription(hobbyDetails.getDescription());
        hobby.setCategory(hobbyDetails.getCategory());
        hobby.setImageUrl(hobbyDetails.getImageUrl());

        return hobbyRepository.save(hobby);
    }

    public void deleteHobby(Integer id) {
        hobbyRepository.deleteById(id);
    }
}
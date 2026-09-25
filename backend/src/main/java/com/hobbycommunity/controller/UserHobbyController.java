package com.hobbycommunity.controller;

import com.hobbycommunity.entity.UserHobby;
import com.hobbycommunity.service.UserHobbyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-hobbies")
@CrossOrigin(origins = "*")
public class UserHobbyController {

    private final UserHobbyService service;

    public UserHobbyController(UserHobbyService service) {
        this.service = service;
    }

    @PostMapping("/join")
    public ResponseEntity<UserHobby> joinHobby(
            @RequestParam Integer userId,
            @RequestParam Integer hobbyId) {

        return ResponseEntity.ok(
                service.joinHobby(userId, hobbyId)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserHobby>> getUserHobbies(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(
                service.getUserHobbies(userId)
        );
    }

    @GetMapping("/hobby/{hobbyId}/count")
    public ResponseEntity<Long> getHobbyMemberCount(
            @PathVariable Integer hobbyId) {

        return ResponseEntity.ok(
                service.getHobbyMemberCount(hobbyId)
        );
    }
}
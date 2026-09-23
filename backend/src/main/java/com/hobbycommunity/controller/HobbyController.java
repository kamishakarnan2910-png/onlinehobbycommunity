package com.hobbycommunity.controller;

import com.hobbycommunity.entity.Hobby;
import com.hobbycommunity.service.HobbyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hobbies")
@CrossOrigin(origins = "*")
public class HobbyController {

    private final HobbyService hobbyService;

    public HobbyController(HobbyService hobbyService) {
        this.hobbyService = hobbyService;
    }

    @GetMapping
    public ResponseEntity<List<Hobby>> getAllHobbies() {
        return ResponseEntity.ok(hobbyService.getAllHobbies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hobby> getHobbyById(@PathVariable Integer id) {
        return hobbyService.getHobbyById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Hobby> createHobby(@RequestBody Hobby hobby) {
        return ResponseEntity.ok(hobbyService.createHobby(hobby));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hobby> updateHobby(
            @PathVariable Integer id,
            @RequestBody Hobby hobby) {

        return ResponseEntity.ok(
                hobbyService.updateHobby(id, hobby)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHobby(
            @PathVariable Integer id) {

        hobbyService.deleteHobby(id);

        return ResponseEntity.ok("Hobby deleted successfully.");
    }
}
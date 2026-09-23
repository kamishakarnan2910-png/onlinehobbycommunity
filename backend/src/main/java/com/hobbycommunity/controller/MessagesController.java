package com.hobbycommunity.controller;

import com.hobbycommunity.entity.Messages;
import com.hobbycommunity.service.MessagesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessagesController {

    private final MessagesService messagesService;

    public MessagesController(MessagesService messagesService) {
        this.messagesService = messagesService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Messages>> getUserMessages(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(
                messagesService.getUserMessages(userId)
        );
    }

    @GetMapping("/conversation/{senderId}/{receiverId}")
    public ResponseEntity<List<Messages>> getConversation(
            @PathVariable Integer senderId,
            @PathVariable Integer receiverId) {

        return ResponseEntity.ok(
                messagesService.getConversation(
                        senderId,
                        receiverId
                )
        );
    }

    @PostMapping
    public ResponseEntity<Messages> sendMessage(
            @RequestBody Messages message) {

        return ResponseEntity.ok(
                messagesService.sendMessage(message)
        );
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Messages> markAsRead(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                messagesService.markAsRead(id)
        );
    }
}
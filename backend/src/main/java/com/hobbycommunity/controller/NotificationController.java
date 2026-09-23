package com.hobbycommunity.controller;

import com.hobbycommunity.entity.Notification;
import com.hobbycommunity.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService) {

        this.notificationService = notificationService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Notification>> getNotifications(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(
                notificationService.getNotifications(userId)
        );
    }

    @PostMapping
    public ResponseEntity<Notification> createNotification(
            @RequestBody Notification notification) {

        return ResponseEntity.ok(
                notificationService.createNotification(
                        notification
                )
        );
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                notificationService.markAsRead(id)
        );
    }
}
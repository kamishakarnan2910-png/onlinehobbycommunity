package com.hobbycommunity.service;

import com.hobbycommunity.entity.Notification;
import com.hobbycommunity.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(
            NotificationRepository notificationRepository) {

        this.notificationRepository =
                notificationRepository;
    }

    public List<Notification> getNotifications(
            Integer userId) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Notification createNotification(
            Notification notification) {

        return notificationRepository.save(notification);
    }

    public Notification markAsRead(
            Integer notificationId) {

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Notification not found"
                                )
                        );

        notification.setRead(true);

        return notificationRepository.save(notification);
    }
}
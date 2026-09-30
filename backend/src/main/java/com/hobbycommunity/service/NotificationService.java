package com.hobbycommunity.service;

import com.hobbycommunity.entity.Notification;
import com.hobbycommunity.entity.User;
import com.hobbycommunity.repository.NotificationRepository;
import com.hobbycommunity.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository) {

        this.notificationRepository =
                notificationRepository;

        this.userRepository =
                userRepository;
    }

    public List<Notification> getNotifications(
            Integer userId) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Notification createNotification(
            Notification notification) {

        return notificationRepository.save(
                notification
        );
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

        return notificationRepository.save(
                notification
        );
    }

    private String getUserName(
            Integer userId) {

        if (userId == null) {
            return "Someone";
        }

        Optional<User> user =
                userRepository.findById(userId);

        if (user.isPresent() &&
                user.get().getName() != null &&
                !user.get().getName().isBlank()) {

            return user.get().getName();
        }

        return "Someone";
    }

    private Notification send(
            Integer receiverId,
            String message) {

        if (receiverId == null) {
            return null;
        }

        Notification notification =
                new Notification();

        notification.setUserId(
                receiverId
        );

        notification.setMessage(
                message
        );

        notification.setRead(false);

        return notificationRepository.save(
                notification
        );
    }

    public Notification notifyFollowRequest(
            Integer senderId,
            Integer receiverId) {

        String senderName =
                getUserName(senderId);

        return send(
                receiverId,
                senderName +
                " sent you a follow request."
        );
    }

    public Notification notifyFollowAccepted(
            Integer accepterId,
            Integer requesterId) {

        String accepterName =
                getUserName(accepterId);

        return send(
                requesterId,
                accepterName +
                " accepted your follow request."
        );
    }

    public Notification notifyNewFollower(
            Integer followerId,
            Integer profileOwnerId) {

        String followerName =
                getUserName(followerId);

        return send(
                profileOwnerId,
                followerName +
                " started following you."
        );
    }

    public Notification notifyCommunityJoin(
            Integer memberId,
            Integer communityOwnerId) {

        String memberName =
                getUserName(memberId);

        return send(
                communityOwnerId,
                memberName +
                " joined your community."
        );
    }

    public Notification notifyNewPost(
            Integer posterId,
            Integer memberId) {

        String posterName =
                getUserName(posterId);

        return send(
                memberId,
                posterName +
                " shared a new post in your community."
        );
    }

    public Notification notifyPostLike(
            Integer likerId,
            Integer postOwnerId) {

        String likerName =
                getUserName(likerId);

        return send(
                postOwnerId,
                likerName +
                " liked your post."
        );
    }

    public Notification notifyPostComment(
            Integer commenterId,
            Integer postOwnerId) {

        String commenterName =
                getUserName(commenterId);

        return send(
                postOwnerId,
                commenterName +
                " commented on your post."
        );
    }

    public Notification notifyNewMessage(
            Integer senderId,
            Integer receiverId) {

        String senderName =
                getUserName(senderId);

        return send(
                receiverId,
                senderName +
                " sent you a message."
        );
    }

    public void notifyAdminsAboutReport(
            Integer reporterId) {

        String reporterName =
                getUserName(reporterId);

        List<User> admins =
                userRepository.findByRole("ADMIN");

        for (User admin : admins) {

            send(
                    admin.getId(),
                    reporterName +
                    " submitted a report."
            );
        }
    }

    public void notifyAdminsAboutContactMessage(
            Integer senderId,
            String senderName) {

        String name = senderName;

        if (name == null || name.isBlank()) {
            name = getUserName(senderId);
        }

        List<User> admins =
                userRepository.findByRole("ADMIN");

        for (User admin : admins) {

            send(
                    admin.getId(),
                    name +
                    " sent a message through Contact Us."
            );
        }
    }
}
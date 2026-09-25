package com.hobbycommunity.service;

import com.hobbycommunity.entity.Messages;
import com.hobbycommunity.repository.MessagesRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessagesService {

    private final MessagesRepository messagesRepository;

    public MessagesService(MessagesRepository messagesRepository) {
        this.messagesRepository = messagesRepository;
    }

    public List<Messages> getUserMessages(Integer userId) {

        return messagesRepository
                .findBySenderIdOrReceiverIdOrderByCreatedAtDesc(
                        userId,
                        userId
                );
    }

    public List<Messages> getConversation(
            Integer userId1,
            Integer userId2) {

        return messagesRepository
                .findBySenderIdAndReceiverIdOrSenderIdAndReceiverIdOrderByCreatedAtAsc(
                        userId1,
                        userId2,
                        userId2,
                        userId1
                );
    }

    public Messages sendMessage(Messages message) {

        return messagesRepository.save(message);
    }

    public Messages markAsRead(Integer messageId) {

        Messages message =
                messagesRepository
                        .findById(messageId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Message not found"
                                )
                        );

        message.setRead(true);

        return messagesRepository.save(message);
    }
}
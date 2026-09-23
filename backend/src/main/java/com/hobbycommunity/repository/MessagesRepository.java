package com.hobbycommunity.repository;

import com.hobbycommunity.entity.Messages;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessagesRepository
        extends JpaRepository<Messages, Integer> {

    List<Messages> findBySenderIdOrReceiverIdOrderByCreatedAtDesc(
            Integer senderId,
            Integer receiverId
    );

    List<Messages> findBySenderIdAndReceiverIdOrderByCreatedAtAsc(
            Integer senderId,
            Integer receiverId
    );
}
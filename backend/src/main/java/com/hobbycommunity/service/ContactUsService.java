package com.hobbycommunity.service;

import com.hobbycommunity.entity.ContactUs;
import com.hobbycommunity.repository.ContactUsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactUsService {

    private final ContactUsRepository contactUsRepository;
    private final NotificationService notificationService;

    public ContactUsService(
            ContactUsRepository contactUsRepository,
            NotificationService notificationService) {

        this.contactUsRepository = contactUsRepository;
        this.notificationService = notificationService;
    }

    public ContactUs saveMessage(ContactUs contactUs) {

        ContactUs savedMessage =
                contactUsRepository.save(contactUs);

        notificationService.notifyAdminsAboutContactMessage(
                savedMessage.getUserId(),
                savedMessage.getName()
        );

        return savedMessage;
    }

    public List<ContactUs> getAllMessages() {

        return contactUsRepository.findAll();
    }

    public void deleteMessage(Integer id) {

        contactUsRepository.deleteById(id);
    }
}
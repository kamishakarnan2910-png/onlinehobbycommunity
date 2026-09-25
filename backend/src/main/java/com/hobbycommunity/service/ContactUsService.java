package com.hobbycommunity.service;

import com.hobbycommunity.entity.ContactUs;
import com.hobbycommunity.repository.ContactUsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactUsService {

    private final ContactUsRepository contactUsRepository;

    public ContactUsService(ContactUsRepository contactUsRepository) {
        this.contactUsRepository = contactUsRepository;
    }

    public ContactUs saveMessage(ContactUs contactUs) {
        return contactUsRepository.save(contactUs);
    }

    public List<ContactUs> getAllMessages() {
        return contactUsRepository.findAll();
    }

    public void deleteMessage(Integer id) {
        contactUsRepository.deleteById(id);
    }
}
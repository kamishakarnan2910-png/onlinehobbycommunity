package com.hobbycommunity.controller;

import com.hobbycommunity.entity.ContactUs;
import com.hobbycommunity.service.ContactUsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactUsController {

    private final ContactUsService contactUsService;

    public ContactUsController(ContactUsService contactUsService) {
        this.contactUsService = contactUsService;
    }

    @PostMapping
    public ResponseEntity<ContactUs> saveMessage(
            @RequestBody ContactUs contactUs) {

        return ResponseEntity.ok(
                contactUsService.saveMessage(contactUs)
        );
    }

    @GetMapping
    public ResponseEntity<List<ContactUs>> getAllMessages() {

        return ResponseEntity.ok(
                contactUsService.getAllMessages()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable Integer id) {

        contactUsService.deleteMessage(id);

        return ResponseEntity.noContent().build();
    }
}
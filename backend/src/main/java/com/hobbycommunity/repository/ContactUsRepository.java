package com.hobbycommunity.repository;

import com.hobbycommunity.entity.ContactUs;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactUsRepository
        extends JpaRepository<ContactUs, Integer> {
}
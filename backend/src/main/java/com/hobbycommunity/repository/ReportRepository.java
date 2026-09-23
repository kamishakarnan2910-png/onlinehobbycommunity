package com.hobbycommunity.repository;

import com.hobbycommunity.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository
        extends JpaRepository<Report, Integer> {

    List<Report> findByStatus(String status);

    List<Report> findByReporterId(Integer reporterId);

    List<Report> findByPostId(Integer postId);
}
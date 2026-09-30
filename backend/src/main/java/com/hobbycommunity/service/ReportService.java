package com.hobbycommunity.service;

import com.hobbycommunity.entity.Report;
import com.hobbycommunity.repository.ReportRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final NotificationService notificationService;

    public ReportService(
            ReportRepository reportRepository,
            NotificationService notificationService) {

        this.reportRepository = reportRepository;
        this.notificationService = notificationService;
    }

    public Report createReport(Report report) {

        if (report.getStatus() == null ||
                report.getStatus().isBlank()) {

            report.setStatus("PENDING");
        }

        if (report.getCreatedAt() == null) {
            report.setCreatedAt(
                    LocalDateTime.now()
            );
        }

        Report savedReport =
                reportRepository.save(report);

        notificationService
                .notifyAdminsAboutReport(
                        report.getReporterId()
                );

        return savedReport;
    }

    public List<Report> getAllReports() {

        return reportRepository.findAll();
    }

    public List<Report> getReportsByStatus(
            String status) {

        return reportRepository.findByStatus(
                status
        );
    }

    public List<Report> getReportsByReporterId(
            Integer reporterId) {

        return reportRepository.findByReporterId(
                reporterId
        );
    }

    public List<Report> getReportsByPostId(
            Integer postId) {

        return reportRepository.findByPostId(
                postId
        );
    }

    public Report updateReportStatus(
            Integer id,
            String status) {

        Report report =
                reportRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Report not found."
                                )
                        );

        report.setStatus(status);

        return reportRepository.save(report);
    }

    public void deleteReport(
            Integer id) {

        if (!reportRepository.existsById(id)) {

            throw new RuntimeException(
                    "Report not found."
            );
        }

        reportRepository.deleteById(id);
    }
}
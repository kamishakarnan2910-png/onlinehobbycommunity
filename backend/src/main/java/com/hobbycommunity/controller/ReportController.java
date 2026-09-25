package com.hobbycommunity.controller;

import com.hobbycommunity.entity.Report;
import com.hobbycommunity.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ResponseEntity<Report> createReport(
            @RequestBody Report report) {

        return ResponseEntity.ok(
                reportService.createReport(report)
        );
    }

    @GetMapping
    public ResponseEntity<List<Report>> getAllReports() {

        return ResponseEntity.ok(
                reportService.getAllReports()
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Report>> getReportsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                reportService.getReportsByStatus(status)
        );
    }

    @GetMapping("/reporter/{reporterId}")
    public ResponseEntity<List<Report>> getReportsByReporterId(
            @PathVariable Integer reporterId) {

        return ResponseEntity.ok(
                reportService.getReportsByReporterId(
                        reporterId
                )
        );
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Report>> getReportsByPostId(
            @PathVariable Integer postId) {

        return ResponseEntity.ok(
                reportService.getReportsByPostId(
                        postId
                )
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Report> updateReportStatus(
            @PathVariable Integer id,
            @RequestParam String status) {

        return ResponseEntity.ok(
                reportService.updateReportStatus(
                        id,
                        status
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(
            @PathVariable Integer id) {

        reportService.deleteReport(id);

        return ResponseEntity.noContent().build();
    }
}
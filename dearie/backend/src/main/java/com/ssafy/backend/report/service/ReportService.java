package com.ssafy.backend.report.service;

import com.ssafy.backend.report.model.dto.response.DiaryAnalyzeResponseDTO;

import java.time.LocalDate;
import java.util.concurrent.CompletableFuture;

public interface ReportService {
    CompletableFuture<DiaryAnalyzeResponseDTO> analyzeAndSaveReportAsync(Long userId, LocalDate date);
    DiaryAnalyzeResponseDTO getAnalysisReport(Long userId, LocalDate date);
    DiaryAnalyzeResponseDTO getSummaryWithSurveyFlag(Long userId, LocalDate date);
}
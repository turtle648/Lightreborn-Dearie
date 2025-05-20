package com.ssafy.backend.report.service;

import com.ssafy.backend.report.model.dto.response.DiaryAnalyzeResponseDTO;

import java.time.LocalDate;

public interface ReportService {
    DiaryAnalyzeResponseDTO analyzeAndSaveReport(Long userId, LocalDate date);
    DiaryAnalyzeResponseDTO getAnalysisReport(Long userId, LocalDate date);
    DiaryAnalyzeResponseDTO getSummaryWithSurveyFlag(Long userId, LocalDate date);
}
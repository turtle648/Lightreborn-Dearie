package com.ssafy.backend.report.controller;

import com.ssafy.backend.report.exception.ReportNotFoundException;
import com.ssafy.backend.report.model.dto.response.DiaryAnalyzeResponseDTO;
import com.ssafy.backend.report.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("my-reports")
@Tag(name = "Report", description = "주간 감정 리포트 관련 API")
public class ReportController {

    private final ReportService reportService;

    @Operation(summary = "주간 감정 리포트 분석 및 저장", description = "GPT로 분석 후 자동 저장까지 처리됩니다.")
    @PostMapping("/analyze")
    public ResponseEntity<DiaryAnalyzeResponseDTO> analyzeAndSaveReport(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("userId") Long userId
    ) {
        DiaryAnalyzeResponseDTO response = reportService.analyzeAndSaveReport(userId, date);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "주간 감정 리포트 조회", description = "저장된 리포트를 조회합니다.")
    @GetMapping("/{date}")
    public ResponseEntity<DiaryAnalyzeResponseDTO> getAnalysisReport(
            @PathVariable("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("userId") Long userId
    ) {
        DiaryAnalyzeResponseDTO response = reportService.getAnalysisReport(userId, date);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "감정 분석 통합 API", description = "일기 분석 결과와 설문 추천 여부를 함께 반환합니다.")
    @GetMapping("/summary")
    public ResponseEntity<DiaryAnalyzeResponseDTO> getSummaryWithSurveyFlag(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("userId") Long userId
    ) {
        DiaryAnalyzeResponseDTO response = reportService.getSummaryWithSurveyFlag(userId, date);
        return ResponseEntity.ok(response);
    }

    @ExceptionHandler(ReportNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleReportNotFoundException(ReportNotFoundException e) {
        Map<String, String> response = new HashMap<>();
        response.put("status", "404");
        response.put("message", e.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }
}

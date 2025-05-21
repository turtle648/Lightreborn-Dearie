package com.ssafy.backend.report.service;

import com.ssafy.backend.auth.model.entity.User;
import com.ssafy.backend.auth.repository.UserRepository;
import com.ssafy.backend.diary.model.dto.response.GetDiaryReportDTO;
import com.ssafy.backend.diary.model.entity.EmotionScore;
import com.ssafy.backend.diary.service.DiaryService;
import com.ssafy.backend.report.exception.ReportNotFoundException;
import com.ssafy.backend.report.gpt.GptClient;
import com.ssafy.backend.report.gpt.GptPromptUtil;
import com.ssafy.backend.report.gpt.GptResult;
import com.ssafy.backend.report.model.dto.response.DiaryAnalyzeResponseDTO;
import com.ssafy.backend.report.model.entity.AnalysisReport;
import com.ssafy.backend.report.repository.AnalysisReportRepository;
import com.ssafy.backend.diary.repository.EmotionScoreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final @Lazy DiaryService diaryService;
    private final GptClient gptClient;
    private final AnalysisReportRepository analysisReportRepository;
    private final UserRepository userRepository;
    private final EmotionScoreRepository emotionScoreRepository;

    @Override
    public CompletableFuture<DiaryAnalyzeResponseDTO> analyzeAndSaveReportAsync(Long userId, LocalDate date) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                return analyzeAndSaveReport(userId, date);
            } catch (Exception e) {
                log.error("\u274c GPT \ub9ac\ud3ec\ud2b8 \ubd84\uc11d \uc624\ub958", e);
                return null;
            }
        });
    }

    public DiaryAnalyzeResponseDTO analyzeAndSaveReport(Long userId, LocalDate date) {
        List<GetDiaryReportDTO> diaries = diaryService.getDiariesOfWeek(userId, date);

        if (diaries == null || diaries.isEmpty()) {
            throw new ReportNotFoundException("최근 일주일간 작성한 일기가 없습니다.");
        }

        if (diaries.size() > 30) {
            diaries = diaries.subList(0, 5);
        }

        String prompt = GptPromptUtil.makePrompt(diaries);
        GptResult result = gptClient.callGpt(prompt);

        log.info("diaries: {}", diaries);
        log.info("GPT Prompt: {}", prompt);
        log.info("GPT summary: {}", result.getSummary());
        log.info("GPT comment: {}", result.getComment());
        log.info("GPT emotionScores: {}", result.getEmotionScores());

        EmotionScore emotionScore = EmotionScore.builder()
                .joy(Double.valueOf(result.getEmotionScores().getOrDefault("기쁨", 0)))
                .sadness(Double.valueOf(result.getEmotionScores().getOrDefault("슬픔", 0)))
                .anger(Double.valueOf(result.getEmotionScores().getOrDefault("분노", 0)))
                .anxiety(Double.valueOf(result.getEmotionScores().getOrDefault("불안", 0)))
                .calm(Double.valueOf(result.getEmotionScores().getOrDefault("평온", 0)))
                .build();

        emotionScore = emotionScoreRepository.save(emotionScore);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AnalysisReport report = analysisReportRepository.findByUserIdAndAnalysisWeekDate(userId, date.atStartOfDay())
                .orElse(null);

        if (report != null) {
            report.setComment(result.getComment());
            report.setEmotionScore(emotionScore);
            analysisReportRepository.save(report);
        } else {
            AnalysisReport newReport = AnalysisReport.builder()
                    .analysisWeekDate(date.atStartOfDay())
                    .comment(result.getComment())
                    .emotionScore(emotionScore)
                    .user(user)
                    .build();
            analysisReportRepository.save(newReport);
        }

        return DiaryAnalyzeResponseDTO.builder()
                .summary(result.getSummary())
                .comment(result.getComment())
                .emotionScores(result.getEmotionScores())
                .build();
    }

    @Override
    public DiaryAnalyzeResponseDTO getAnalysisReport(Long userId, LocalDate date) {
        AnalysisReport report = analysisReportRepository.findByUserIdAndAnalysisWeekDate(userId, date.atStartOfDay())
                .orElseThrow(() -> new ReportNotFoundException("해당 기간의 리포트가 존재하지 않습니다."));

        EmotionScore score = report.getEmotionScore();
        Map<String, Integer> emotionScores = Map.of(
                "기쁨", score.getJoy().intValue(),
                "슬픔", score.getSadness().intValue(),
                "분노", score.getAnger().intValue(),
                "불안", score.getAnxiety().intValue(),
                "평온", score.getCalm().intValue()
        );

        return DiaryAnalyzeResponseDTO.builder()
                .summary("")
                .comment(report.getComment())
                .emotionScores(emotionScores)
                .build();
    }

    @Override
    public DiaryAnalyzeResponseDTO getSummaryWithSurveyFlag(Long userId, LocalDate date) {
        try {
            DiaryAnalyzeResponseDTO result = getAnalysisReport(userId, date);

            // 1. 퍼센트로 변환
            Map<String, Integer> rawScores = result.getEmotionScores();
            int total = rawScores.values().stream().mapToInt(Integer::intValue).sum();
            Map<String, Integer> percentScores = rawScores.entrySet().stream()
                    .collect(java.util.stream.Collectors.toMap(
                            Map.Entry::getKey,
                            entry -> total == 0 ? 0 : (int) Math.round(entry.getValue() * 100.0 / total)
                    ));

            // 2. 설문 추천 여부 판단 (퍼센트 기준)
            boolean needSurvey = percentScores.getOrDefault("슬픔", 0) >= 40
                    || percentScores.getOrDefault("불안", 0) >= 40
                    || percentScores.getOrDefault("분노", 0) >= 40;

            // 3. 퍼센트 기반 emotionScores 반환
            return DiaryAnalyzeResponseDTO.builder()
                    .summary(result.getSummary())
                    .comment(result.getComment())
                    .emotionScores(percentScores)
                    .needSurvey(needSurvey)
                    .build();
        } catch (ReportNotFoundException e) {
            throw new ReportNotFoundException("해당 기간의 리포트가 존재하지 않습니다.");
        }
    }
}
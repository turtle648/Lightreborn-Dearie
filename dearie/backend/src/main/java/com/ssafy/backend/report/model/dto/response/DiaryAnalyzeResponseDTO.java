package com.ssafy.backend.report.model.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
@Builder
public class DiaryAnalyzeResponseDTO {
    private String summary;
    private String comment;
    private Map<String, Integer> emotionScores;
    private boolean needSurvey;
}
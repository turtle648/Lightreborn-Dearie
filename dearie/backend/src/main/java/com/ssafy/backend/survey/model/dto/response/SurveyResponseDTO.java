package com.ssafy.backend.survey.model.dto.response;

import com.ssafy.backend.survey.model.entity.Survey;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class SurveyResponseDTO {
    private Long id;
    private LocalDateTime createdAt;
    private Integer surveyResult;
    private Integer totalScore;

    public static SurveyResponseDTO from (Survey survey, Integer totalScore) {
        return SurveyResponseDTO.builder()
                .id(survey.getId())
                .surveyResult(survey.getSurveyResult())
                .createdAt(survey.getCreatedAt())
                .totalScore(totalScore)
                .build();
    }
}

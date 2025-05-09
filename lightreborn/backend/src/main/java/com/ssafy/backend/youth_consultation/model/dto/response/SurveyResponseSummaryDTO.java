package com.ssafy.backend.youth_consultation.model.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class SurveyResponseSummaryDTO {
    private String name;
    private Integer age;
    private Integer isolationScore;
    private SurveyScaleResponseDTO surveyScale;
    private List<SurveyQuestionWithAnswerDTO> answers;
}

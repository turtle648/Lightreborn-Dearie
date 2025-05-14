package com.ssafy.backend.survey.model.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class YouthSurveyQuestionDTO {
    private List<QuestionDTO> questions;
    private List<AgreementDTO> agreements;

    public static YouthSurveyQuestionDTO from(List<QuestionDTO> questions, List<AgreementDTO> agreements) {
        return YouthSurveyQuestionDTO.builder()
                .questions(questions)
                .agreements(agreements)
                .build();
    }
}

package com.ssafy.backend.youth_consultation.model.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SurveyQuestionWithAnswerDTO {
    private String questionCode;
    private String answer;
    private String question;
}

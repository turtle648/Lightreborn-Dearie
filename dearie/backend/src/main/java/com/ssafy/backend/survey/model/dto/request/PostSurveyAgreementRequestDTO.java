package com.ssafy.backend.survey.model.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class PostSurveyAgreementRequestDTO {
    @Schema(name = "설문 응답의 pk", description = "1")
    private Long surveyId;
}

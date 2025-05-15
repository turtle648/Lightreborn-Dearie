package com.ssafy.backend.survey.model.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

import java.util.List;

@Getter
public class PostSurveyAgreementRequestDTO {
    @Schema(description = "설문 응답의 pk", example = "1")
    private Long surveyId;

    @Schema(description = "동의 현황")
    private List<AgreementRequestDTO> agreements;
}

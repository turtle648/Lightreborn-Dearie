package com.ssafy.backend.survey.model.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class SurveyConsentLogResponseDTO {
    private Long surveyId;
    private List<SurveyConsentLogDTO> agreements;

    public static SurveyConsentLogResponseDTO from (Long surveyId, List<SurveyConsentLogDTO> agreements) {
        return SurveyConsentLogResponseDTO.builder()
                .surveyId(surveyId)
                .agreements(agreements)
                .build();
    }
}

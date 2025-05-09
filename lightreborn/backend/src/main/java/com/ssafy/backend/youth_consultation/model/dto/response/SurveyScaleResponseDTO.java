package com.ssafy.backend.youth_consultation.model.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SurveyScaleResponseDTO {
    private Long versionId;
    private Integer socioeconomicScore;
    private Integer socialInteractionScore;
    private Integer lifestyleScore;
    private LocalDate surveyDate;
}

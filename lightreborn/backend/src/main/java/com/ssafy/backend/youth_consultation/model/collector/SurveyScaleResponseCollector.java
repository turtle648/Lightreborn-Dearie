package com.ssafy.backend.youth_consultation.model.collector;

import com.ssafy.backend.youth_consultation.model.dto.response.SurveyScaleResponseDTO;
import com.ssafy.backend.youth_consultation.model.entity.SurveyScaleScores;
import com.ssafy.backend.youth_consultation.model.entity.SurveyVersion;
import lombok.Getter;

import java.util.List;

@Getter
public class SurveyScaleResponseCollector {
    private final SurveyScaleResponseDTO surveyScaleResponseDTO;
    private final List<SurveyScaleResponseDTO> surveyScaleResponseDTOS;

    public SurveyScaleResponseCollector(SurveyVersion surveyVersion) {
        this.surveyScaleResponseDTO = convertToDto(surveyVersion);
        this.surveyScaleResponseDTOS = null;
    }

    public SurveyScaleResponseCollector(List<SurveyVersion> surveyVersions) {
        this.surveyScaleResponseDTO = null;
        this.surveyScaleResponseDTOS = convertToDtos(surveyVersions);
    }

    public SurveyScaleResponseCollector(SurveyVersion surveyVersion, List<SurveyVersion> surveyVersions) {
        this.surveyScaleResponseDTO = (surveyVersion != null) ? convertToDto(surveyVersion) : null;
        this.surveyScaleResponseDTOS = (surveyVersions != null) ? convertToDtos(surveyVersions) : null;
    }

    private SurveyScaleResponseDTO convertToDto(SurveyVersion surveyVersion) {
        SurveyScaleScores scores = surveyVersion.getScaleScores();
        return SurveyScaleResponseDTO
                .builder()
                .versionId(surveyVersion.getId())
                .surveyDate(surveyVersion.getSurveyDate())
                .lifestyleScore(scores != null ? scores.getLifestyleScore() : null)
                .socioeconomicScore(scores != null ? scores.getSocioeconomicScore() : null)
                .socialInteractionScore(scores != null ? scores.getSocialInteractionScore() : null)
                .build();
    }

    private List<SurveyScaleResponseDTO> convertToDtos(List<SurveyVersion> surveyVersions) {
        return surveyVersions.stream()
                .map(this::convertToDto)
                .toList();
    }
}

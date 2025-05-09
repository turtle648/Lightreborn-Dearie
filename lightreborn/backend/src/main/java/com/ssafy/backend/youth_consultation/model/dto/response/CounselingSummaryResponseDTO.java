package com.ssafy.backend.youth_consultation.model.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class CounselingSummaryResponseDTO {
    private Long personalId;
    private String name;
    private int age;
    private int isolatedScore;
    private List<CounselingResponseDTO> counselingList;
    private SurveyScaleResponseDTO currSurveyScale;
    private List<SurveyScaleResponseDTO> surveyList;
}

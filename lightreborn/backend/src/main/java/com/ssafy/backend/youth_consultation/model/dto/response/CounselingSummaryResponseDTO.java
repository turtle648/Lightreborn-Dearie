package com.ssafy.backend.youth_consultation.model.dto.response;

import java.util.List;

public class CounselingSummaryResponseDTO {
    private String name;
    private int age;
    private int surveyScore;
    private List<CounselingResponseDTO> counselingList;
    private SurveyScaleResponseDTO currSurveyScale;
    private List<SurveyScaleResponseDTO> surveyList;
}

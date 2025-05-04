package com.ssafy.backend.youth_consultation.model.dto.response;

import com.ssafy.backend.youth_consultation.model.collector.PersonalInfoCollector;
import com.ssafy.backend.youth_consultation.model.vo.UserAnswers;
import lombok.Builder;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ToString
@Builder
public class SurveyUploadDTO {
    public PersonalInfoCollector personalInfo;
    public UserAnswers answers;
}

package com.ssafy.backend.survey.model.dto.request;

import com.ssafy.backend.survey.model.entity.Survey;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Getter
@Builder
public class SurveySendRequestDTO {
    // == survey ==
    private LocalDateTime createdAt;
    private String surveyResult;

    private UserInfoDTO user;
    private List<SurveyAnswerDTO> answers;

    public static SurveySendRequestDTO from (Survey survey, UserInfoDTO userInfoDTO, List<SurveyAnswerDTO> answers) {
        return SurveySendRequestDTO.builder()
                .createdAt(survey.getCreatedAt())
                .surveyResult(survey.getSurveyResult())
                .user(userInfoDTO)
                .answers(answers)
                .build();
    }
}

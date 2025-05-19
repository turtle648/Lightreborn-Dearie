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
    private String createdAt;
    private Integer surveyResult;

    private UserInfoDTO user;
    private List<SurveyAnswerDTO> answers;

    public static SurveySendRequestDTO from (UserInfoDTO userInfoDTO, List<SurveyAnswerDTO> answers, Integer score) {
        return SurveySendRequestDTO.builder()
                .createdAt(LocalDateTime.now().toString())
                .surveyResult(score)
                .user(userInfoDTO)
                .answers(answers)
                .build();
    }

    public static SurveySendRequestDTO from (Survey survey, UserInfoDTO userInfoDTO, List<SurveyAnswerDTO> answers) {
        return SurveySendRequestDTO.builder()
                .createdAt(survey.getCreatedAt().toString())
                .surveyResult(survey.getSurveyResult())
                .user(userInfoDTO)
                .answers(answers)
                .build();
    }
}

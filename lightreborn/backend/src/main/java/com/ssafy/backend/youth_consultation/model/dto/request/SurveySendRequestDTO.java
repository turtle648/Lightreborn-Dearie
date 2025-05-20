package com.ssafy.backend.youth_consultation.model.dto.request;

import lombok.*;

import java.util.List;

@Data
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SurveySendRequestDTO {
    private String createdAt;
    private Integer surveyResult;

    private UserInfoDTO user;
    private List<SurveyAnswerDTO> answers;
}

package com.ssafy.backend.survey.model.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

import java.util.List;

@Getter
public class PostSurveyByGuestRequestDTO {
    @Schema(description = "개인정보")
    private UserInfoDTO personalInfo;

    @Schema(description = "질문에 대한 응답 리스트")
    private List<SurveyAnswerRequestDTO> answers;
}

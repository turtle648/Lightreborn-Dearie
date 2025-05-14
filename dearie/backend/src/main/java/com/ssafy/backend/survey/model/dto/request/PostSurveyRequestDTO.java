package com.ssafy.backend.survey.model.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

import java.util.List;

@Getter
@Schema(description = "설문 응답 제출 요청 DTO")
public class PostSurveyRequestDTO {
    @Schema(description = "질문에 대한 응답 리스트")
    private List<SurveyAnswerDTO> answers;
}

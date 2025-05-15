package com.ssafy.backend.survey.model.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class SurveyAnswerRequestDTO {
    @Schema(description = "질문 ID", example = "12")
    private Long questionId;
    @Schema(description = "객관식 선택지 id", example = "5")
    private Long optionId;
    @Schema(description = "주관식 답변 내용", example = "현재는 쉬는 중입니다.")
    private String answerText;
}

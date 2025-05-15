package com.ssafy.backend.survey.model.dto.request;

import com.ssafy.backend.survey.model.entity.Survey;
import com.ssafy.backend.survey.model.entity.SurveyAnswer;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;

@Data
@Getter
@Builder
public class SurveyAnswerDTO {
    private String answerText;
    private String answerChoice;

    public static SurveyAnswerDTO from (SurveyAnswer answer) {
        return SurveyAnswerDTO.builder()
                .answerChoice(
                        answer.getAnswerChoice() != null ? answer.getAnswerChoice().getOptionText() : null
                )
                .answerText(answer.getAnswerText())
                .build();
    }
}

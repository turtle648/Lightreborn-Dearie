package com.ssafy.backend.survey.model.dto.request;

import com.ssafy.backend.survey.model.entity.Survey;
import com.ssafy.backend.survey.model.entity.SurveyAnswer;
import com.ssafy.backend.survey.model.entity.SurveyQuestion;
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
    private String question;


    public static SurveyAnswerDTO from (SurveyAnswer answer) {
        SurveyQuestion surveyQuestion = answer.getSurveyQuestion();
        return SurveyAnswerDTO.builder()
                .answerChoice(
                        answer.getAnswerChoice() != null ? answer.getAnswerChoice().getOptionText() : null
                )
                .answerText(answer.getAnswerText())
                .question(formatQuestion(surveyQuestion))
                .build();
    }

    private static String formatQuestion(SurveyQuestion q) {
        if (q.getQuestionCode() == null || q.getQuestionCode().isBlank()) {
            return q.getContent();
        }
        return q.getQuestionCode() + " " + q.getContent();
    }
}

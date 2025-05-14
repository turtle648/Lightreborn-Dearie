package com.ssafy.backend.survey.model.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ssafy.backend.survey.model.entity.SurveyOption;
import com.ssafy.backend.survey.model.entity.SurveyQuestion;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
@ToString
public class QuestionDTO {
    private String code;
    private String description;
    private List<String> option;

    public static QuestionDTO from(SurveyQuestion question, List<SurveyOption> options) {
        List<String> optionLabels = options.stream()
                .map(SurveyOption::getOptionText)
                .toList();

        return QuestionDTO.builder()
                .code(question.getQuestionCode())
                .description(question.getContent())
                .option(optionLabels)
                .build();
    }
}

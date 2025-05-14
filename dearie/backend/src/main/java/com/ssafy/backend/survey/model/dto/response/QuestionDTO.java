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
    private Long questionId;
    private String code;
    private String description;
    private List<OptionDTO> options;

    public static QuestionDTO from(SurveyQuestion question, List<SurveyOption> options) {
        List<OptionDTO> optionLabels = options.stream()
                .map(OptionDTO::from)
                .toList();

        return QuestionDTO.builder()
                .questionId(question.getId())
                .code(question.getQuestionCode())
                .description(question.getContent())
                .options(optionLabels)
                .build();
    }
}

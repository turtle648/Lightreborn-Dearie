package com.ssafy.backend.youth_consultation.model.collector;

import com.ssafy.backend.youth_consultation.model.dto.response.SurveyQuestionWithAnswerDTO;
import com.ssafy.backend.youth_consultation.model.entity.SurveyAnswer;
import com.ssafy.backend.youth_consultation.model.entity.SurveyQuestion;
import lombok.Getter;

import java.util.List;

@Getter
public class SurveyQuestionWithAnswerCollector {
    private final List<SurveyQuestionWithAnswerDTO> surveyQuestionWithAnswerDTOS;

    public SurveyQuestionWithAnswerCollector(List<SurveyAnswer> answers) {
        this.surveyQuestionWithAnswerDTOS = convertToDTOS(answers);
    }

    private List<SurveyQuestionWithAnswerDTO> convertToDTOS(List<SurveyAnswer> answers) {
        return answers.stream()
                .map(survey -> {
                    String answer = survey.getAnswerChoice() == null ? survey.getAnswerText() : survey.getAnswerChoice();
                    SurveyQuestion question = survey.getSurveyQuestion();
                    return SurveyQuestionWithAnswerDTO.builder()
                            .answer(answer)
                            .question(question.getContent())
                            .questionCode(question.getQuestionCode())
                            .build();
                })
                .toList();
    }
}

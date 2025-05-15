package com.ssafy.backend.survey.model.vo;

import com.ssafy.backend.survey.exception.SurveyErrorCode;
import com.ssafy.backend.survey.exception.SurveyException;
import com.ssafy.backend.survey.model.entity.Survey;
import com.ssafy.backend.survey.model.entity.SurveyAnswer;
import com.ssafy.backend.survey.model.entity.SurveyOption;
import com.ssafy.backend.survey.model.entity.SurveyQuestion;
import com.ssafy.backend.survey.model.state.SurveyType;
import lombok.Getter;

@Getter
public class SurveyAnswerVO {
    private final String answerText;
    private final SurveyOption answerChoice;
    private final SurveyQuestion surveyQuestion;
    private final Survey survey;

    private SurveyAnswerVO(String answerText, SurveyOption answerChoice, SurveyQuestion surveyQuestion, Survey survey) {
        this.answerText = answerText;
        this.answerChoice = answerChoice;
        this.surveyQuestion = surveyQuestion;
        this.survey = survey;
    }

    public static SurveyAnswerVO of (String answerText, SurveyOption answerChoice, SurveyQuestion surveyQuestion, Survey survey) {
        if(surveyQuestion == null) {
            throw new SurveyException(SurveyErrorCode.SURVEY_QUESTION_REQUIRED);
        }

        if(survey == null) {
            throw new SurveyException(SurveyErrorCode.SURVEY_REQUIRED);
        }

        if (surveyQuestion.getSurveyType().equals(SurveyType.SUBJECTIVE) && answerText.isBlank()) {
            throw new SurveyException(SurveyErrorCode.ANSWER_TEXT_REQUIRED);
        }

        if (surveyQuestion.getSurveyType().equals(SurveyType.OBJECTIVE) && answerChoice == null) {
            throw new SurveyException(SurveyErrorCode.ANSWER_CHOICE_REQUIRED);
        }

        return new SurveyAnswerVO(answerText, answerChoice, surveyQuestion, survey);
    }

    public static SurveyAnswer toEntity (SurveyAnswerVO vo) {
        return SurveyAnswer.builder()
                .answerChoice(vo.answerChoice)
                .answerText(vo.answerText)
                .surveyQuestion(vo.surveyQuestion)
                .survey(vo.survey)
                .build();
    }

}

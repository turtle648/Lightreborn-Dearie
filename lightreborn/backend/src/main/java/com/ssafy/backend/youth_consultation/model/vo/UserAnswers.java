package com.ssafy.backend.youth_consultation.model.vo;

import com.ssafy.backend.youth_consultation.entity.SurveyAnswer;
import com.ssafy.backend.youth_consultation.entity.SurveyQuestion;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@ToString
public class UserAnswers {
    private final List<SurveyAnswer> answers = new ArrayList<>();

    public void add(SurveyQuestion question, String answer) {

        answers.add(
                SurveyAnswer.builder()
                        .answerText(answer)
                        .surveyQuestion(question)
                        .build()
        );
    }

    public void addPersonalInfo() {

    }
}

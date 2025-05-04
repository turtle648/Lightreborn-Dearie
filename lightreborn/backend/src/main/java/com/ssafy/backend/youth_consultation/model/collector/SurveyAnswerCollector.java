package com.ssafy.backend.youth_consultation.model.collector;

import com.ssafy.backend.youth_consultation.entity.PersonalInfo;
import com.ssafy.backend.youth_consultation.entity.SurveyAnswer;
import com.ssafy.backend.youth_consultation.entity.SurveyQuestion;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@ToString
public class SurveyAnswerCollector {
    private final List<SurveyAnswer> answers = new ArrayList<>();

    public void addAnswerText(SurveyQuestion question, String answer) {
        answers.add(
                SurveyAnswer.builder()
                        .answerText(answer)
                        .surveyQuestion(question)
                        .build()
        );
    }

    public void addAnswerChoice(SurveyQuestion question, String answer) {
        answers.add(
                SurveyAnswer.builder()
                        .answerChoice(answer)
                        .surveyQuestion(question)
                        .build()
        );
    }


    public void addPersonalInfo(PersonalInfo personalInfo) {
        List<SurveyAnswer> updated = new ArrayList<>();

        for (SurveyAnswer answer : answers) {
            updated.add(SurveyAnswer.builder()
                    .answerText(answer.getAnswerText())
                    .answerChoice(answer.getAnswerChoice())
                    .surveyQuestion(answer.getSurveyQuestion())
                    .personalInfo(personalInfo)
                    .build());
        }

        answers.clear();
        answers.addAll(updated);
    }

    public List<SurveyAnswer> getAnswers() {
        return List.copyOf(answers);
    }
}

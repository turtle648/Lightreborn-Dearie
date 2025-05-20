package com.ssafy.backend.youth_consultation.model.collector;

import com.ssafy.backend.youth_consultation.model.entity.SurveyAnswer;
import com.ssafy.backend.youth_consultation.model.entity.SurveyQuestion;
import com.ssafy.backend.youth_consultation.model.entity.SurveyVersion;
import com.ssafy.backend.youth_consultation.model.state.Answer;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

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


    public void addVersion(SurveyVersion surveyVersion) {
        List<SurveyAnswer> updated = new ArrayList<>();

        for (SurveyAnswer answer : answers) {
            updated.add(SurveyAnswer.builder()
                    .answerText(answer.getAnswerText())
                    .answerChoice(answer.getAnswerChoice())
                    .surveyQuestion(answer.getSurveyQuestion())
                    .surveyVersion(surveyVersion)
                    .build());
        }

        answers.clear();
        answers.addAll(updated);
    }

    public List<SurveyAnswer> getAnswers() {
        return List.copyOf(answers);
    }

    public Integer getScore () {
        return answers.stream().mapToInt(answer -> {
            String a = StringUtils.hasText(answer.getAnswerChoice()) ? answer.getAnswerChoice() : answer.getAnswerText();
            log.info("getScore: {}",a);
            return Answer.findScoreByAnswer(a);
        }).sum();
    }
}

package com.ssafy.backend.survey.repository;

import com.ssafy.backend.survey.model.entity.SurveyAnswer;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SurveyAnswerRepository extends JpaRepository<SurveyAnswer, Long> {
    @EntityGraph(attributePaths = {"answerChoice", "surveyQuestion"})
    List<SurveyAnswer> findAllBySurveyId(Long surveyId);
}

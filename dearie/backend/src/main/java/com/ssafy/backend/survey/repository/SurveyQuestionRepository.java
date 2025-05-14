package com.ssafy.backend.survey.repository;

import com.ssafy.backend.survey.model.entity.SurveyQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SurveyQuestionRepository extends JpaRepository<SurveyQuestion, Long> {
    List<SurveyQuestion> findAllBySurveyTemplateId(Long surveyTemplateId);
}

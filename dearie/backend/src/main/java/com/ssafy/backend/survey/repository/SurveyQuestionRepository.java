package com.ssafy.backend.survey.repository;

import com.ssafy.backend.survey.model.entity.SurveyQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SurveyQuestionRepository extends JpaRepository<SurveyQuestion, Long> {
}

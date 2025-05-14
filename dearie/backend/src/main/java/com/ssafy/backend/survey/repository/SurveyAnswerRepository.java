package com.ssafy.backend.survey.repository;

import com.ssafy.backend.survey.model.entity.SurveyAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SurveyAnswerRepository extends JpaRepository<SurveyAnswer, Long> {
}

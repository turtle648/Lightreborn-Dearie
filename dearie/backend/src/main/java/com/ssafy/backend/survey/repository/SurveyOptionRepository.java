package com.ssafy.backend.survey.repository;

import com.ssafy.backend.survey.model.entity.SurveyOption;
import com.ssafy.backend.survey.model.entity.SurveyQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SurveyOptionRepository extends JpaRepository<SurveyOption, Long> {
    List<SurveyOption> findAllBySurveyQuestionOrderByOptionNumAsc(SurveyQuestion surveyQuestion);
}

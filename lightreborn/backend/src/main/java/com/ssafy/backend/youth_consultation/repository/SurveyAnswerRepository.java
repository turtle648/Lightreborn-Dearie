package com.ssafy.backend.youth_consultation.repository;

import com.ssafy.backend.youth_consultation.model.entity.SurveyAnswer;
import com.ssafy.backend.youth_consultation.model.entity.SurveyVersion;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SurveyAnswerRepository extends JpaRepository<SurveyAnswer, Long> {
    @EntityGraph(attributePaths = "surveyQuestion")
    List<SurveyAnswer> findAllBySurveyVersion(SurveyVersion surveyVersion);
}

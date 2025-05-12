package com.ssafy.backend.survey.repository;

import com.ssafy.backend.survey.entity.Survey;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SurveyRepository extends JpaRepository<Survey, Long> {
}

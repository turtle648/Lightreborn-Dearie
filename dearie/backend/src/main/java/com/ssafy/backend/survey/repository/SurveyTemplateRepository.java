package com.ssafy.backend.survey.repository;

import com.ssafy.backend.survey.model.entity.SurveyTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SurveyTemplateRepository extends JpaRepository<SurveyTemplate, Long> {
}

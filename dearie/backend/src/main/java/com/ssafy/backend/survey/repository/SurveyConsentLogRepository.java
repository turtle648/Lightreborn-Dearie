package com.ssafy.backend.survey.repository;

import com.ssafy.backend.survey.model.entity.SurveyConsentLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SurveyConsentLogRepository extends JpaRepository<SurveyConsentLog, Long> {
}

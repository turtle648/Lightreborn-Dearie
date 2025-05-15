package com.ssafy.backend.survey.repository;

import com.ssafy.backend.survey.model.entity.SurveyConsentLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SurveyConsentLogRepository extends JpaRepository<SurveyConsentLog, Long> {
    List<SurveyConsentLog> findAllBySurveyId(Long surveyId);
    int countBySurveyIdAndIsAgreedTrue(Long surveyId);
}

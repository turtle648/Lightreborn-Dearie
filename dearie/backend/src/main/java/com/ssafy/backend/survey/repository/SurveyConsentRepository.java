package com.ssafy.backend.survey.repository;

import com.ssafy.backend.survey.model.entity.SurveyConsent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SurveyConsentRepository extends JpaRepository<SurveyConsent, Long> {
    List<SurveyConsent> findAllBySurveyTemplateId(Long surveyTemplateId);
}

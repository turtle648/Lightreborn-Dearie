package com.ssafy.backend.survey.model.vo;

import com.ssafy.backend.survey.exception.SurveyErrorCode;
import com.ssafy.backend.survey.exception.SurveyException;
import com.ssafy.backend.survey.model.entity.Survey;
import com.ssafy.backend.survey.model.entity.SurveyConsent;
import com.ssafy.backend.survey.model.entity.SurveyConsentLog;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class SurveyConsentLogVO {
    private final Boolean isAgreed;
    private final LocalDateTime agreedAt;
    private final SurveyConsent surveyConsent;
    private final Survey survey;

    private SurveyConsentLogVO(Boolean isAgreed, LocalDateTime agreedAt, SurveyConsent surveyConsent, Survey survey) {
        this.isAgreed = isAgreed;
        this.agreedAt = agreedAt;
        this.surveyConsent = surveyConsent;
        this.survey = survey;
    }

    public static SurveyConsentLogVO of (Boolean isAgreed, SurveyConsent surveyConsent, Survey survey) {
        if(isAgreed == null) {
            throw new SurveyException(SurveyErrorCode.AGREEMENT_REQUIRED);
        }
        if(surveyConsent == null) {
            throw new SurveyException(SurveyErrorCode.SURVEY_CONSENT_REQUIRED);
        }
        if(survey == null) {
            throw new SurveyException(SurveyErrorCode.SURVEY_REQUIRED);
        }
        LocalDateTime agreedAt = LocalDateTime.now();
        return new SurveyConsentLogVO(isAgreed, agreedAt, surveyConsent, survey);
    }

    public static SurveyConsentLog toEntity (SurveyConsentLogVO vo) {
        return SurveyConsentLog.builder()
                .surveyConsent(vo.surveyConsent)
                .agreedAt(vo.agreedAt)
                .survey(vo.survey)
                .isAgreed(vo.isAgreed)
                .build();
    }
}

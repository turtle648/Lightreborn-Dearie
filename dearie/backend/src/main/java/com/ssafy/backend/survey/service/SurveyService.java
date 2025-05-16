package com.ssafy.backend.survey.service;

import com.ssafy.backend.survey.model.dto.request.PostSurveyAgreementRequestDTO;
import com.ssafy.backend.survey.model.dto.request.PostSurveyRequestDTO;
import com.ssafy.backend.survey.model.dto.response.SurveyConsentLogResponseDTO;
import com.ssafy.backend.survey.model.dto.response.SurveyResponseDTO;
import com.ssafy.backend.survey.model.dto.response.SurveyResponseDetailDTO;
import com.ssafy.backend.survey.model.dto.response.YouthSurveyQuestionDTO;

public interface SurveyService {
    YouthSurveyQuestionDTO getIsolatedYouthSurveyQuestions();

    SurveyResponseDTO postIsolatedYouthSurvey(String userId, PostSurveyRequestDTO requestDTO);

    SurveyConsentLogResponseDTO postIsolatedYouthSurveyAgreement(PostSurveyAgreementRequestDTO requestDTO);

    void sendDataToDashBoard(String userId, Long surveyId);

    SurveyResponseDetailDTO getIsolatedYouthSurveyDetailInfo(Long surveyId);
}

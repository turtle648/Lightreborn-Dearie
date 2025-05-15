package com.ssafy.backend.survey.service;

import com.ssafy.backend.survey.model.dto.request.PostSurveyAgreementRequestDTO;
import com.ssafy.backend.survey.model.dto.request.PostSurveyRequestDTO;
import com.ssafy.backend.survey.model.dto.response.SurveyResponseDTO;
import com.ssafy.backend.survey.model.dto.response.YouthSurveyQuestionDTO;

public interface SurveyService {
    YouthSurveyQuestionDTO getIsolatedYouthSurveyQuestions();

    SurveyResponseDTO postIsolatedYouthSurvey(String userId, PostSurveyRequestDTO requestDTO);

    void postIsolatedYouthSurveyAgreement(String userId, PostSurveyAgreementRequestDTO requestDTO);
}

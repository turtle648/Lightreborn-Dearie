package com.ssafy.backend.survey.service;

import com.ssafy.backend.survey.model.dto.request.PostSurveyRequestDTO;
import com.ssafy.backend.survey.model.dto.response.YouthSurveyQuestionDTO;

public interface SurveyService {
    YouthSurveyQuestionDTO getIsolatedYouthSurveyQuestions();

    void postIsolatedYouthSurvey(String userId, PostSurveyRequestDTO requestDTO);
}

package com.ssafy.backend.survey.service;

import com.ssafy.backend.survey.model.dto.response.YouthSurveyQuestionDTO;

public interface SurveyService {
    YouthSurveyQuestionDTO getIsolatedYouthSurveyQuestions();
}

package com.ssafy.backend.survey.service;


import com.ssafy.backend.survey.model.constant.SurveyConstant;
import com.ssafy.backend.survey.model.dto.response.YouthSurveyQuestionDTO;
import com.ssafy.backend.survey.model.entity.SurveyQuestion;
import com.ssafy.backend.survey.repository.SurveyQuestionRepository;
import com.ssafy.backend.survey.repository.SurveyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SurveyServiceImpl implements SurveyService {
    private final SurveyRepository surveyRepository;
    private final SurveyQuestionRepository surveyQuestionRepository;

    @Override
    public YouthSurveyQuestionDTO getIsolatedYouthSurveyQuestions() {
        // 질문을 들고 오고
        // 질문에 대한 옵션들을 가져온다
        return null;
    }
}

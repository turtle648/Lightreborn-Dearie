package com.ssafy.backend.survey.service;


import com.ssafy.backend.survey.model.collector.AgreementCollector;
import com.ssafy.backend.survey.model.collector.QuestionCollector;
import com.ssafy.backend.survey.model.constant.SurveyConstant;
import com.ssafy.backend.survey.model.dto.response.AgreementDTO;
import com.ssafy.backend.survey.model.dto.response.QuestionDTO;
import com.ssafy.backend.survey.model.dto.response.YouthSurveyQuestionDTO;
import com.ssafy.backend.survey.model.entity.SurveyConsent;
import com.ssafy.backend.survey.model.entity.SurveyOption;
import com.ssafy.backend.survey.model.entity.SurveyQuestion;
import com.ssafy.backend.survey.repository.SurveyConsentRepository;
import com.ssafy.backend.survey.repository.SurveyOptionRepository;
import com.ssafy.backend.survey.repository.SurveyQuestionRepository;
import com.ssafy.backend.survey.repository.SurveyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SurveyServiceImpl implements SurveyService {
    private final SurveyRepository surveyRepository;
    private final SurveyQuestionRepository surveyQuestionRepository;
    private final SurveyOptionRepository surveyOptionRepository;
    private final SurveyConsentRepository surveyConsentRepository;

    @Override
    public YouthSurveyQuestionDTO getIsolatedYouthSurveyQuestions() {
        QuestionCollector questionCollector = new QuestionCollector();
        AgreementCollector agreementCollector = new AgreementCollector();

        // 질문을 들고 오고
        List<SurveyQuestion> questions = surveyQuestionRepository.findAllBySurveyTemplateId(SurveyConstant.DEFAULT_TEMPLATE);
        log.info("[SurveyServiceImpl] 설문 리스트 가져오기: {}", questions);

        // 질문에 대한 옵션들을 가져온다
        questions.forEach(question -> {
            List<SurveyOption> surveyOptions = surveyOptionRepository.findAllBySurveyQuestionOrderByOptionNumAsc(question);
            questionCollector.add(QuestionDTO.from(question, surveyOptions));
        });
        log.info("[SurveyServiceImpl] 질문과 보기 매핑 완료: {}", questionCollector.getQuestionDTOS());

        // 개인정보 동의 항목들을 가져온다
        List<SurveyConsent> surveyConsents = surveyConsentRepository.findAllBySurveyTemplateId(SurveyConstant.DEFAULT_TEMPLATE);
        surveyConsents.forEach(consent -> agreementCollector.add(AgreementDTO.from(consent)));

        log.info("[SurveyServiceImpl] 개인정보 동의 항목들 가져오기 완료: {}", agreementCollector.getAgreementDTOS());

        return YouthSurveyQuestionDTO.from(questionCollector.getQuestionDTOS(), agreementCollector.getAgreementDTOS());
    }
}

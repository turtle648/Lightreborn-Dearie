package com.ssafy.backend.survey.service;


import com.ssafy.backend.auth.exception.AuthErrorCode;
import com.ssafy.backend.auth.exception.AuthException;
import com.ssafy.backend.auth.model.entity.User;
import com.ssafy.backend.auth.repository.UserRepository;
import com.ssafy.backend.survey.exception.SurveyErrorCode;
import com.ssafy.backend.survey.exception.SurveyException;
import com.ssafy.backend.survey.model.collector.AgreementCollector;
import com.ssafy.backend.survey.model.collector.QuestionCollector;
import com.ssafy.backend.survey.model.constant.SurveyConstant;
import com.ssafy.backend.survey.model.dto.request.AgreementRequestDTO;
import com.ssafy.backend.survey.model.dto.request.PostSurveyAgreementRequestDTO;
import com.ssafy.backend.survey.model.dto.request.PostSurveyRequestDTO;
import com.ssafy.backend.survey.model.dto.request.SurveyAnswerRequestDTO;
import com.ssafy.backend.survey.model.dto.response.*;
import com.ssafy.backend.survey.model.entity.*;
import com.ssafy.backend.survey.model.vo.SurveyAnswerVO;
import com.ssafy.backend.survey.model.vo.SurveyConsentLogVO;
import com.ssafy.backend.survey.model.vo.SurveyVO;
import com.ssafy.backend.survey.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SurveyServiceImpl implements SurveyService {
    private final UserRepository userRepository;
    private final SurveyRepository surveyRepository;
    private final SurveyQuestionRepository surveyQuestionRepository;
    private final SurveyOptionRepository surveyOptionRepository;
    private final SurveyConsentRepository surveyConsentRepository;
    private final SurveyTemplateRepository surveyTemplateRepository;
    private final SurveyAnswerRepository surveyAnswerRepository;
    private final SurveyConsentLogRepository surveyConsentLogRepository;

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

    @Override
    @Transactional
    public SurveyResponseDTO postIsolatedYouthSurvey(String userId, PostSurveyRequestDTO requestDTO) {
        User user = userRepository.findByLoginId(userId)
                .orElseThrow(() -> new AuthException(AuthErrorCode.USER_NOT_FOUND));

        SurveyTemplate surveyTemplate = surveyTemplateRepository.findById(SurveyConstant.DEFAULT_TEMPLATE)
                .orElseThrow(() -> new SurveyException(SurveyErrorCode.SURVEY_REQUIRED));

        List<SurveyAnswerRequestDTO> answers = requestDTO.getAnswers();

        // 설문 질문들 가져오기
        List<Long> questionIds = answers.stream()
                .map(SurveyAnswerRequestDTO::getQuestionId)
                .toList();
        List<SurveyQuestion> questions = surveyQuestionRepository.findAllById(questionIds);

        // 보기 문항들 가져오기
        List<Long> optionIds = answers.stream()
                .map(SurveyAnswerRequestDTO::getOptionId)
                .toList();
        List<SurveyOption> options = surveyOptionRepository.findAllById(optionIds);

        // 질문/보기 pk-객체 묶어 놓기 (검색 효율을 위함)
        Map<Long, SurveyQuestion> questionMap = questions.stream()
                .collect(Collectors.toMap(SurveyQuestion::getId, Function.identity()));
        Map<Long, SurveyOption> answerMap = options.stream()
                .collect(Collectors.toMap(SurveyOption::getId, Function.identity()));

        // survey 부터 저장해서 pk 만들고
        Survey survey = saveSurvey(user, surveyTemplate, answers, options);

        // total score 계산하기
        Integer totalScore = calculateTotalScore(questions);

        // 이 pk로 answer 저장하기
        List<SurveyAnswerVO> answerVOs = answers.stream()
                .map(answer -> {
                    SurveyQuestion question = questionMap.get(answer.getQuestionId());
                    if (question == null) throw new SurveyException(SurveyErrorCode.QUESTION_NOT_FOUND);

                    SurveyOption answerChoice = answer.getOptionId() == null ? null : answerMap.get(answer.getOptionId());
                    if (answer.getOptionId() != null && answerChoice == null) throw new SurveyException(SurveyErrorCode.OPTION_NOT_FOUND);

                    return SurveyAnswerVO.of(answer.getAnswerText(), answerChoice, question, survey);
                })
                .toList();

        surveyAnswerRepository.saveAll(answerVOs.stream()
                .map(SurveyAnswerVO::toEntity)
                .toList());

        return SurveyResponseDTO.from(survey, totalScore);
    }

    @Override
    public SurveyConsentLogResponseDTO postIsolatedYouthSurveyAgreement(String userId, PostSurveyAgreementRequestDTO requestDTO) {
        List<Long> consentIds = requestDTO.getAgreements()
                .stream()
                .map(AgreementRequestDTO::getAgreementId)
                .toList();
        List<SurveyConsent> consents = surveyConsentRepository.findAllById(consentIds);

        Map<Long, SurveyConsent> consentMap = consents.stream()
                .collect(Collectors.toMap(SurveyConsent::getId, Function.identity()));

        Survey survey = surveyRepository.findById(requestDTO.getSurveyId())
                .orElseThrow(() -> new SurveyException(SurveyErrorCode.SURVEY_REQUIRED));

        List<SurveyConsentLogVO> surveyConsentLogVOS = requestDTO.getAgreements().stream().map(agreement -> {
            SurveyConsent consent = consentMap.get(agreement.getAgreementId());

            if(consent == null) {
                throw new SurveyException(SurveyErrorCode.SURVEY_CONSENT_REQUIRED);
            }

            return SurveyConsentLogVO.of(agreement.getIsAgreed(), consentMap.get(agreement.getAgreementId()), survey);
        }).toList();

        List<SurveyConsentLog> surveyConsentLogs = surveyConsentLogRepository.saveAll(
                surveyConsentLogVOS.stream()
                        .map(SurveyConsentLogVO::toEntity)
                        .toList()
        );

        List<SurveyConsentLogDTO> surveyConsentLogDTOS = surveyConsentLogs.stream()
                .map(SurveyConsentLogDTO::from)
                .toList();

        return SurveyConsentLogResponseDTO.from(survey.getId(), surveyConsentLogDTOS);
    }

    private Integer calculateTotalScore (List<SurveyQuestion> questions) {
        return surveyOptionRepository.findTopOptionsBySurveyQuestions(questions)
                .stream()
                .mapToInt(SurveyOption::getScore)
                .sum();
    }

    private Survey saveSurvey (User user, SurveyTemplate surveyTemplate, List<SurveyAnswerRequestDTO> answers,
                               List<SurveyOption> options) {
        int result = calculateScore(answers, options);

        SurveyVO surveyVO = SurveyVO.of(Integer.toString(result), user, surveyTemplate);

        return surveyRepository.save(SurveyVO.toEntity(surveyVO));
    }

    private int calculateScore(List<SurveyAnswerRequestDTO> answers, List<SurveyOption> options) {
        List<Integer> scores = options.stream()
                .map(SurveyOption::getScore)
                .toList();

        return scores.stream().mapToInt(Integer::intValue).sum();
    }
}

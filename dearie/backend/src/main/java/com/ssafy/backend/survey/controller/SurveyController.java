package com.ssafy.backend.survey.controller;

import com.ssafy.backend.common.dto.BaseResponse;
import com.ssafy.backend.survey.model.dto.request.PostSurveyAgreementRequestDTO;
import com.ssafy.backend.survey.model.dto.request.PostSurveyRequestDTO;
import com.ssafy.backend.survey.model.dto.response.SurveyConsentLogResponseDTO;
import com.ssafy.backend.survey.model.dto.response.SurveyResponseDTO;
import com.ssafy.backend.survey.model.dto.response.SurveyResponseDetailDTO;
import com.ssafy.backend.survey.model.dto.response.YouthSurveyQuestionDTO;
import com.ssafy.backend.survey.service.SurveyService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/survey")
@Tag(name="survey", description = "설문 관련 API")
public class SurveyController {
    private final SurveyService surveyService;

    @GetMapping("/isolated-youth/questions")
    public ResponseEntity<BaseResponse<YouthSurveyQuestionDTO>> getIsolatedYouthSurveyQuestions() {
        YouthSurveyQuestionDTO response = surveyService.getIsolatedYouthSurveyQuestions();

        log.info("[/isolated-youth/questions] 응답 생성 완료: {}", response);

        return ResponseEntity.ok(BaseResponse.success("청년 온라인 자가점검 설문지를 불러왔습니다.", response));
    }

    @PostMapping("/isolated-youth")
    public ResponseEntity<BaseResponse<SurveyResponseDTO>> postIsolatedYouthSurvey(
            @AuthenticationPrincipal String userId,
            @RequestBody PostSurveyRequestDTO requestDTO
    ) {
        SurveyResponseDTO response = surveyService.postIsolatedYouthSurvey(userId, requestDTO);
        return ResponseEntity.ok(BaseResponse.success(201, "청년 온라인 자가점검 설문 응답을 완료하였습니다.", response));
    }

    @PostMapping("/isolated-youth/agreement")
    public ResponseEntity<BaseResponse<SurveyConsentLogResponseDTO>> postIsolatedYouthSurveyAgreement(
            @AuthenticationPrincipal String userId,
            @RequestBody PostSurveyAgreementRequestDTO requestDTO
    ) {
        SurveyConsentLogResponseDTO response = surveyService.postIsolatedYouthSurveyAgreement(requestDTO);
        return ResponseEntity.ok(BaseResponse.success(201, "청년 온라인 자가점검 설문 개인정보 수집 동의를 완료하였습니다.", response));
    }

    @PostMapping("/isolated-youth/{surveyId}/send")
    public ResponseEntity<BaseResponse<String>> postIsolatedYouthSurveyToDashboard (
            @AuthenticationPrincipal String userId,
            @PathVariable("surveyId") Long surveyId
    ) {
        surveyService.sendDataToDashBoard(userId, surveyId);
        return ResponseEntity.ok(BaseResponse.success(201, "청년 온라인 자가점검 설문을 대시보드로 전송 완료하였습니다."));
    }

    @GetMapping("/isolated-youth/{surveyId}/results")
    public ResponseEntity<BaseResponse<SurveyResponseDetailDTO>> getIsolatedYouthSurveyDetailInfo (
            @PathVariable("surveyId") Long surveyId
    ) {
        SurveyResponseDetailDTO surveyResponseDetailDTO = surveyService.getIsolatedYouthSurveyDetailInfo(surveyId);
        return ResponseEntity.ok(BaseResponse.success("청년 온라인 자가점검 설문 결과를 가져오는데 성공하였습니다.", surveyResponseDetailDTO));
    }
}
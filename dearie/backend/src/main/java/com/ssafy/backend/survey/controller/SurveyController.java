package com.ssafy.backend.survey.controller;

import com.ssafy.backend.common.dto.BaseResponse;
import com.ssafy.backend.survey.model.dto.response.YouthSurveyQuestionDTO;
import com.ssafy.backend.survey.service.SurveyService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
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
}
package com.ssafy.backend.survey.controller;

import com.ssafy.backend.common.dto.BaseResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/survey")
@Tag(name="survey", description = "설문 관련 API")
public class SurveyController {

    @GetMapping("/isolated-youth/questions")
    public ResponseEntity<BaseResponse<String>> getIsolatedYouthSurveyQuestions() {


        return ResponseEntity.ok(BaseResponse.success("청년 온라인 자가점검 설문지를 불러왔습니다."));
    }
}
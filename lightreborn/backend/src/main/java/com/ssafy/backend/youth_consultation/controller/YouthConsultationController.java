package com.ssafy.backend.youth_consultation.controller;

import com.ssafy.backend.common.dto.BaseResponse;
import com.ssafy.backend.youth_consultation.model.dto.request.SpeechRequestDTO;
import com.ssafy.backend.youth_consultation.model.dto.response.SpeechResponseDTO;
import com.ssafy.backend.youth_consultation.service.SpeechService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/youth-consultation")
@Tag(name = "YouthConsultation", description = "상담일지 관련 API")
public class YouthConsultationController {

    private final SpeechService speechService;

    @PostMapping("/isolated-youth")
    @Operation(
            summary = "설문 데이터 업로드",
            description = "설문 응답 결과를 워드 파일로 업로드 합니다.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    content = @Content(
                            mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                            schema = @Schema(type = "string", format = "binary")
                    )
            )
    )
    public ResponseEntity<BaseResponse<String>> uploadSurveyFile(
            @Parameter(description = "업로드할 워드 파일 (.docx 등)", required = true)
            @RequestPart MultipartFile file
            ) {


        return ResponseEntity.ok(BaseResponse.success("은둔 고립 청년 설문 데이터를 성공적으로 추가했습니다"));
    }

    @PostMapping(value = "/data", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
            summary = "상담 일지 업로드",
            description = "음성 파일과 고립 청년 ID를 함께 업로드합니다.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    content = @Content(
                            mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                            schema = @Schema(implementation = SpeechRequestDTO.class)
                    )
            )
    )
    public ResponseEntity<BaseResponse<SpeechResponseDTO>> uploadRecordFile(
            @ModelAttribute SpeechRequestDTO request
            ) {

        SpeechResponseDTO response = speechService.getGeneralSummarize(request);

        return ResponseEntity
                .ok(BaseResponse.success(200, "음성 변환을 완료하였습니다", response));
    }
}

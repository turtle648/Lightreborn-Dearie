package com.ssafy.backend.youth_consultation.controller;

import com.ssafy.backend.common.dto.BaseResponse;
import com.ssafy.backend.youth_consultation.dto.response.SpeechResponseDTO;
import com.ssafy.backend.youth_consultation.service.SpeechService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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

    @PostMapping(
            value = "/data",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Operation(
            summary = "상담 일지 업로드",
            description = "음성 파일을 업로드하면 서버에서 WAV(16kHz mono PCM)로 변환 후 Whisper로 텍스트 변환합니다."
    )
    public ResponseEntity<BaseResponse<SpeechResponseDTO>> uploadRecordFile(
            @Parameter(description = "업로드할 상담 음성 파일 (.m4a 등)", required = true)
            @RequestPart("file") MultipartFile file
    ) {
        SpeechResponseDTO response = speechService.getGeneralSummarize(file);

        return ResponseEntity
                .ok(BaseResponse.success(200, "음성 변환을 완료하였습니다", response));
    }
}

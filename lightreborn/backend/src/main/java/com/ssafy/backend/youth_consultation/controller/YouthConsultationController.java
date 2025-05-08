package com.ssafy.backend.youth_consultation.controller;

import com.ssafy.backend.common.dto.BaseResponse;
import com.ssafy.backend.youth_consultation.model.dto.request.*;
import com.ssafy.backend.youth_consultation.model.dto.response.*;
import com.ssafy.backend.youth_consultation.service.YouthConsultationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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

    private final YouthConsultationService youthConsultationService;

    @GetMapping("/")
    @Operation(
            summary = "상담 일지 리스트 가져오기 (5개씩)",
            description = "상담 일지 리스트 가져옵니다. default size는 5입니다."
    )
    public ResponseEntity<BaseResponse<GetCounselingLogResponseDTO>> searchIsolationYouthWithPagination(
            @RequestParam(value = "page", defaultValue = "0") int pageNum,
            @RequestParam(value = "size", defaultValue = "5") int sizeNum
    ) {
        GetCounselingLogResponseDTO responseDTO = youthConsultationService.getCounselingLog(pageNum, sizeNum);

        return ResponseEntity.ok().body(BaseResponse.success("상담 대상자를 성공적으로 검색하였습니다.", responseDTO));
    }

    @PostMapping("/statistics")
    @Operation(
            summary = "월별/일별 상담 일지 리스트 가져오기",
            description = "월별 상담 일지 리스트 가져옵니다."
    )
    public ResponseEntity<BaseResponse<GetCounselingLogResponseDTO>> getMonthlyCounselingLog (
            @RequestBody @Valid GetMonthlyCounselingLogDTO request
            ) {
        GetCounselingLogResponseDTO responseDTO = youthConsultationService.getMonthlyCounselingLog(request);

        return ResponseEntity.ok().body(BaseResponse.success("월별/일별 상담일지를 성공적으로 검색하였습니다.", responseDTO));
    }


    @PostMapping("/people")
    @Operation(
            summary = "상담 대상자 이름으로 검색하기 (5명씩)",
            description = "name 이 있을 때는 고립 청년을 이름으로 검색한 결과를 5명씩 페이지네이션 하여 가져옵니다 \nname이 없으면, 고립 청년을 5명씩 페이지네이션 하여 가져옵니다"
    )
    public ResponseEntity<BaseResponse<PeopleInfoResponseDTO>> searchIsolationYouthWithPagination(
            @RequestBody PeopleInfoRequestDTO peopleInfoRequestDTO
            ) {
        PeopleInfoResponseDTO responseDTO = youthConsultationService.searchPeopleInfo(peopleInfoRequestDTO);

        return ResponseEntity.ok().body(BaseResponse.success("상담 대상자를 성공적으로 검색하였습니다.", responseDTO));
    }

    @PostMapping("/{youthId}/schedules")
    @Operation(
            summary = "상담 일정 추가",
            description = "고립 청년 pk를 통해 상담 일정 추가합니다."
    )
    public ResponseEntity<BaseResponse<AddScheduleResponseDTO>> addSchedule(
            @PathVariable Long youthId,
            @RequestBody AddScheduleRequestDTO addScheduleRequestDTO
            ) {
        AddScheduleResponseDTO addScheduleResponseDTO = youthConsultationService.addSchedule(youthId, addScheduleRequestDTO);

        return ResponseEntity.ok().body(BaseResponse.success("상담 일정을 성공적으로 추가하였습니다.", addScheduleResponseDTO));
    }

    @PostMapping(
            value = "/isolated-youth",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Operation(
            summary = "설문 데이터 업로드",
            description = "설문 응답 결과를 워드 파일로 업로드 합니다."
    )
    public ResponseEntity<BaseResponse<SurveyUploadDTO>> uploadSurveyFile(
            @Parameter(
                    description = "업로드할 워드 파일 (.docx 등)",
                    required = true
            )
            @RequestPart("file") MultipartFile file
            ) {
        SurveyUploadDTO surveyUploadDTO = youthConsultationService.uploadIsolationYouthInfo(file);

        return ResponseEntity.ok(BaseResponse.success("은둔 고립 청년 설문 데이터를 성공적으로 추가했습니다", surveyUploadDTO));
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

        SpeechResponseDTO response = youthConsultationService.getGeneralSummarize(request);

        return ResponseEntity
                .ok(BaseResponse.success(200, "음성 변환을 완료하였습니다", response));
    }

    @GetMapping(value = "/summary")
    @Operation(
            summary = "상담 현황",
            description = "전체 누적 상담자 및 최근 3개월 상담 현황 데이터를 얻습니다."
    )
    public ResponseEntity<BaseResponse<ConsultationResponseDTO>> getConsultationSummaryStats() {

        ConsultationResponseDTO response = youthConsultationService.getConsultationSummaryStats();

        return ResponseEntity.ok(BaseResponse.success(200, "상담 현황 정보를 얻었습니다.", response));
    }

    @GetMapping(value = "/yearly-consultations")
    @Operation(
            summary = "월별 상담 현황",
            description = "1년을 기준으로 월별 상담 건수에 대한 데이터를 얻습니다."
    )
    public ResponseEntity<BaseResponse<YearlyConsultationDTO>> getYearlyConsultationSummary(@RequestParam(value = "year", required = false) Integer year) {

        YearlyConsultationDTO response = youthConsultationService.getYearlyConsultationSummary();

        return ResponseEntity.ok(BaseResponse.success(200, "올해 월별 상담 정보를 얻었습니다.", response));
    }

    @PatchMapping("/{counselingId}")
    @Operation(
            summary = "상담 일지 AI 코멘트 수정",
            description = "상담 일지 pk를 통해 AI 코멘트에 대해서 수정 가능하다."
    )
    public ResponseEntity<BaseResponse<SpeechResponseDTO>> updateCounselingLog(
            @PathVariable Long counselingId,
            @RequestBody UpdateCounselingLogRequestDTO request
    ) {

        SpeechResponseDTO response = youthConsultationService.updateCounselingLog(counselingId, request);

        return ResponseEntity
                .ok(BaseResponse.success("상담 일지 AI 코멘트를 수정 완료 하였습니다.", response));
    }
}

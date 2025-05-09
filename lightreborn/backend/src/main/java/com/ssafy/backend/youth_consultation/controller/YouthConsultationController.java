package com.ssafy.backend.youth_consultation.controller;

import com.ssafy.backend.common.dto.BaseResponse;
import com.ssafy.backend.youth_consultation.model.dto.request.*;
import com.ssafy.backend.youth_consultation.model.dto.response.*;
import com.ssafy.backend.youth_consultation.service.YouthConsultationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/youth-consultation")
@Tag(name = "YouthConsultation", description = "상담일지 관련 API")
public class YouthConsultationController {

    private final YouthConsultationService youthConsultationService;

    @GetMapping("")
    @Operation(
            summary = "상담 일지 리스트 가져오기 (5개씩)",
            description = """
                    📋 **상담 일지 리스트를 페이지 단위로 조회합니다.**
                    
                    - 기본 페이지 크기: **5**
                    - 페이지네이션을 위한 `page`, `size` 파라미터 사용 가능
                    - 최신순 정렬로 반환됩니다.
                    
                    🔸 **용도**: \s
                    - 상담일지 관리 대시보드에서 은둔고립청년 상담 기록을 조회하기 위한 API입니다.
                    """
    )
    public ResponseEntity<BaseResponse<GetCounselingLogsResponseDTO>> searchIsolationYouthWithPagination(
            @RequestParam(value = "page", defaultValue = "0") int pageNum,
            @RequestParam(value = "size", defaultValue = "5") int sizeNum
    ) {
        GetCounselingLogsResponseDTO responseDTO = youthConsultationService.getCounselingLog(pageNum, sizeNum);

        return ResponseEntity.ok().body(BaseResponse.success("상담 대상자를 성공적으로 검색하였습니다.", responseDTO));
    }

    @PostMapping("/statistics")
    @Operation(
            summary = "월별/일별 상담 일지 리스트 가져오기",
            description = """
                    📋 **월별/일별 상담 일지 리스트 가져옵니다.**
                    
                    🔹 **쿼리 조건**
                    - 연도(`year`)와 월(`month`)을 함께 전달하면 **월별 조회**
                    - 날짜(`date`, 예: `"2025-05-24"`)를 전달하면 **일별 조회**
                    - 두 방식은 **서로 배타적**입니다 (둘 다 보내면 예외 발생)
            
                    🔹 **페이징**
                    - 기본 페이지 크기: **5**
                    - `page` (기본값 0), `size` 파라미터로 제어
                    
                    🔸 **용도**: \s
                    - 상담일지 관리 대시보드에서 일정 확인에서 월별/일별 상담 일지 리스트를 조회하기 위한 API입니다.
                    """
    )
    public ResponseEntity<BaseResponse<GetCounselingLogsResponseDTO>> getMonthlyCounselingLog (
            @RequestBody @Valid GetMonthlyCounselingLogDTO request
            ) {
        GetCounselingLogsResponseDTO responseDTO = youthConsultationService.getMonthlyCounselingLog(request);

        return ResponseEntity.ok().body(BaseResponse.success("월별/일별 상담일지를 성공적으로 검색하였습니다.", responseDTO));
    }

    @GetMapping("/counseling/{counselingId}")
    @Operation(
            summary = "상담 일지 상세 정보 가져오기",
            description = """
                    📋 **특정 상담 일지의 상세 정보를 조회합니다.**
                    
                    🔹 **경로 파라미터**
                    - `counselingId`: 조회할 상담 일지의 고유 ID
                    
                    🔸 **용도**
                    - 상담일지 작성 시작 대시보드
                    - 상담일지 상세 조회 대시보드 (이미 작성된 일지 보기)
                    
                    등에서 초기 상담 정보를 불러올 때 사용하는 API입니다.
                    """
    )
    public ResponseEntity<BaseResponse<GetCounselingLogResponseDTO>> getCounselingLogById (
            @PathVariable(value = "counselingId") Long counselingId
    ) {
        GetCounselingLogResponseDTO responseDTO = youthConsultationService.getCounselingLogById(counselingId);

        return ResponseEntity.ok()
                .body(
                        BaseResponse.success(
                                counselingId + "에 대한 상담 일지 상세 정보를 성공적으로 가져 왔습니다.",
                                responseDTO
                        )
                );
    }

    @PatchMapping("/counseling/{counselingId}")
    @Operation(
            summary = "상담 일지 AI 코멘트 수정",
            description = """
                    📋 **특정 상담 일지의 AI 분석 결과(코멘트)를 수정합니다.**
            
                    🔹 **경로 변수**
                    - `counselingId`: 수정할 상담 일지의 고유 ID
            
                    🔹 **요청 바디 (`UpdateCounselingLogRequestDTO`)**
                    - `summary`: 상담 전체 요약
                    - `client`: 내담자 키워드
                    - `counselor`: 상담자 키워드
                    - `memos`: 특이사항 또는 메모
            
                    🔸 **용도**
                    - 녹음파일 AI 분석 완료 대시보드 
                    등에서 상담일지 기록을 마친 후, 상담 관리자가 코멘트를 보완할 때 사용됩니다.
                    """
    )
    public ResponseEntity<BaseResponse<SpeechResponseDTO>> updateCounselingLog(
            @PathVariable Long counselingId,
            @RequestBody UpdateCounselingLogRequestDTO request
    ) {

        SpeechResponseDTO response = youthConsultationService.updateCounselingLog(counselingId, request);

        return ResponseEntity
                .ok(BaseResponse.success("상담 일지 AI 코멘트를 수정 완료 하였습니다.", response));
    }

    @GetMapping("/counseling/export-excel")
    @Operation(
            summary = "전체 상담 일지 데이터 Excel 다운로드",
            description = """
                📋 **전체 상담 일지 데이터를 Excel 파일로 다운로드합니다.**

                🔹 **형식**
                - 파일 형식: `XLSX`
                - 컬럼: 상담 ID, 상담 일자, 고립 청년 이름 등

                🔸 **용도**
                - 상담일지 관리 - 은둔고립청년 상담일지 다운로드
                """,
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Excel 파일 다운로드 성공",
                            content = @Content(
                                    mediaType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                    schema = @Schema(type = "string", format = "binary")
                            )
                    )
            }
    )
    public ResponseEntity<byte[]> exportCounselingLogToExcel() {
        ExportCounselingLogResponseDTO dto = youthConsultationService.exportCounselingLogToExcel();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=" + URLEncoder.encode(dto.getFileName(),
                                StandardCharsets.UTF_8
                        ).replace("+", "%20"))
                .contentType(MediaType.parseMediaType(dto.getContentType()))
                .contentLength(dto.getFileSize())
                .body(dto.getFileContent());
    }


    @PostMapping("/people")
    @Operation(
            summary = "상담 대상자 검색 또는 전체 목록 조회",
            description = """
                    📋 **상담 대상자를 이름으로 검색하거나 전체 목록을 조회합니다.**
            
                    🔹 **검색 조건**
                    - `name`이 존재하면 해당 이름을 포함한 고립청년 목록을 조회
                    - `name`이 없으면 전체 대상자를 조회
                    - 모두 5명씩 페이지네이션 처리됩니다.
            
                    🔹 **페이징**
                    - 기본 페이지 크기: **5**
                    - `page` (기본값: 0), `size`로 페이지 제어 가능
            
                    🔸 **용도**
                    - 상담일정 추가 화면에서 상담 대상자를 검색하거나 목록을 가져올 때 사용됩니다.
                    """
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
            description = """
                    📋 **고립 청년 ID를 통해 상담 일정을 추가합니다.**
            
                    🔹 **요청 경로**
                    - `youthId`: 상담 대상자의 고유 ID
            
                    🔹 **요청 바디**
                    - `date`: 상담 일정 날짜 (예: `"2025-05-07"`)
            
                    🔸 **용도**
                    - 상담일정 추가 화면에서, 상담 대상자에게 상담 일정을 등록할 때 사용하는 API입니다.
                    """
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
            summary = "설문 응답 워드 파일 업로드",
            description = """
                    📋 **은둔고립청년의 설문 응답 결과가 담긴 Word 파일을 업로드합니다.**
            
                    🔹 **요청 형식**
                    - `multipart/form-data` 형식
                    - 파일 필드명: `file`
                    - 지원 확장자: `.docx` (Microsoft Word)
            
                    🔹 **처리 내용**
                    - 문서에서 설문 문항과 응답을 파싱하여 저장
                    - 응답자 정보 및 설문 버전 정보도 함께 처리됨
            
                    🔸 **용도**
                    - 상담대상자 관리 페이지
                    등에서 고립청년 초기 설문 데이터 등록을 위한 API 입니다.
                    """
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
            description = """
                    📋 **고립 청년 ID와 음성 파일(.m4a 등)을 함께 업로드합니다.**
                    
                    🔹 **요청 형식**
                    - `multipart/form-data`
                    - `file`: 음성 파일 (예: `.m4a`, `.mp3`)
                    - `isolatedYouthId`: 고립 청년의 고유 ID

                    🔸 **용도**
                    - 상담일지 작성 시작 대시보드 등에서
                    상담 요약 AI 분석을 위해 음성을 서버에 업로드할 때 사용됩니다.
                    """,
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

    @GetMapping(value = "/{personalInfoId}/summary")
    @Operation(
            summary = "개인 상담 일지",
            description = """
                    📋 **특정 내담자의 상담 일지 요약 데이터를 얻습니다 **
            
                    🔹 **요청 경로**
                    - `youthId`: 상담 대상자의 고유 ID
                        
                    🔸 **용도**
                    - 4-1-1. 관리 청년 상세 정보 화면
                    등 에서 필요한 정보를 가져오기 위한 API 입니다.
                    """
    )
    public ResponseEntity<BaseResponse<CounselingSummaryResponseDTO>> getPersonalCounselingLogSummary(@PathVariable Long personalInfoId) {
        CounselingSummaryResponseDTO response = youthConsultationService.getPersonalCounselingLogSummary(personalInfoId);

        return ResponseEntity.ok(BaseResponse.success(200, "내담자의 상담 정보를 얻었습니다.", response));
    }

    @GetMapping(value = "/{personalInfoId}")
    @Operation(
            summary = "척도 설문 응답 내역",
            description = """
                    📋 **특정 내담자의 척도 설문 응답 내역을 얻습니다 **
            
                    🔹 **요청 경로**
                    - `personalInfoId`: 상담 대상자의 고유 ID
                    - `versionId`: 설문 고유 id
                        
                    🔸 **용도**
                    - 4-1-2. 관리 청년 상세 정보 - 척도설문 자세히 보기
                    등 에서 필요한 정보를 가져오기 위한 API 입니다.
                    """
    )
    public ResponseEntity<BaseResponse<SurveyResponseSummaryDTO>> getSurveyResponseSummaryInfo (
            @PathVariable("personalInfoId") Long personalInfoId,
            @RequestParam(value = "survey-version") Long versionId
    ) {
        SurveyResponseSummaryDTO response = youthConsultationService.getSurveyResponseSummaryInfo(personalInfoId, versionId);

        return ResponseEntity.ok(BaseResponse.success("내담자의 상담 정보를 얻었습니다.", response));
    }


    @GetMapping(value = "/isolated-youths")
    @Operation(
            summary = "상담 리스트",
            description = "은둔 고립 청년 정보(이름, 연령, 점수 등)리스트를 반환하는 함수"
    )
    public ResponseEntity<BaseResponse<Page<IsolatedYouthResponseDTO>>> list(
            @ParameterObject
            @SortDefault.SortDefaults({
                    @SortDefault(sort = "consultationDate", direction = Sort.Direction.DESC),
                    @SortDefault(sort = "isolatedYouth.personalInfo.name", direction = Sort.Direction.ASC)
            })
            @PageableDefault(size = 7)
            Pageable pageable) {

        Page<IsolatedYouthResponseDTO> response = youthConsultationService.getList(pageable);

        return ResponseEntity.ok(BaseResponse.success(200, "고립청년들의 정보를 얻었습니다.", response));
    }

    @GetMapping(value = "/isolated-youths/pre-support")
    @Operation(
            summary = "은둔 고립 청년 발굴 및 선정 데이터",
            description = "은둔 고립 청년 발굴 및 선정 절차에 있는 청년들의 데이터를 조회하는 함수"
    )
    public ResponseEntity<BaseResponse<Page<PreSupportIsolatedYouthResponseDTO>>> preSupportList(@ParameterObject @PageableDefault(sort = "personalInfo.name", direction = Sort.Direction.ASC, size = 7) Pageable pageable) {

        Page<PreSupportIsolatedYouthResponseDTO> response = youthConsultationService.getPresupportList(pageable);

        return ResponseEntity.ok(BaseResponse.success(200, "은둔 고립 청년 발굴 및 선정 절차 정보를 얻었습니다.", response));
    }
}

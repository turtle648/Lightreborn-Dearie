package com.ssafy.backend.youth_consultation.service;

import com.ssafy.backend.youth_consultation.model.dto.request.*;
import com.ssafy.backend.youth_consultation.model.dto.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;


public interface YouthConsultationService {
    GetCounselingLogsResponseDTO getCounselingLog(int pageNum, int sizeNum);
    GetCounselingLogsResponseDTO getMonthlyCounselingLog(GetMonthlyCounselingLogDTO request);
    GetCounselingLogResponseDTO getCounselingLogById(Long id);
    ExportCounselingLogResponseDTO exportCounselingLogToExcel();
    PeopleInfoResponseDTO searchPeopleInfo(PeopleInfoRequestDTO peopleInfoRequestDTO);
    AddScheduleResponseDTO addSchedule(String userId, Long id, AddScheduleRequestDTO addScheduleRequestDTO);
    SpeechResponseDTO getGeneralSummarize(String loginUser, SpeechRequestDTO responseDTO);
    SurveyUploadDTO uploadIsolationYouthInfo(MultipartFile file);
    SpeechResponseDTO updateCounselingLog(Long id, UpdateCounselingLogRequestDTO requestDTO);

    /**
     * 누적 통계 및 최근 3개월 신규 상담 등록자 통계를 계산하는 함수
     *
     * @return 전체 누적 상담자 수, 카테고리별 분포, 최근 3개월 신규 등록자 수를 포함한 DTO
     */
    ConsultationResponseDTO getConsultationSummaryStats();

    /**
     * 특정 연도의 월별 상담 건수를 계산하여 반환하는 함수
     *
     * @return 현재 연도와 이전 연도의 월별 상담 건수를 포함한 DTO
     */
    YearlyConsultationDTO getYearlyConsultationSummary();

    Page<IsolatedYouthResponseDTO> getList(Pageable pageable);

    Page<PreSupportIsolatedYouthResponseDTO> getPresupportList(Pageable pageable);

    CounselingSummaryResponseDTO getPersonalCounselingLogSummary(Long personalInfoId);

    SurveyResponseSummaryDTO getSurveyResponseSummaryInfo(Long personalInfoId, Long versionId);
}

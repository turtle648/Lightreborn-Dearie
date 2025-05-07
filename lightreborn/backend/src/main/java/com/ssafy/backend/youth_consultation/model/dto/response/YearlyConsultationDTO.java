package com.ssafy.backend.youth_consultation.model.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * 연도별 상담 건수를 담는 응답 DTO.
 * 최근 연도와 이전 연도의 월별 상담 건수를 함께 반환한다.
 */
@Getter
@Builder
public class YearlyConsultationDTO {

    /**
     * 현재 연도 (예: 2025)
     */
    private Integer currentYear;

    /**
     * 현재 연도의 월별 상담 건수 (index: 0 = 1월, ... 11 = 12월)
     */
    private List<Integer> currentMonthlyCount;

    /**
     * 이전 연도 (예: 2024)
     */
    private Integer previousYear;

    /**
     * 이전 연도의 월별 상담 건수
     */
    private List<Integer> previousMonthlyCount;
}

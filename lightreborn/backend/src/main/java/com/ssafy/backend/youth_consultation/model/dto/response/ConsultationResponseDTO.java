package com.ssafy.backend.youth_consultation.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
public class ConsultationResponseDTO {
    /**
     * 전체 누적 상담자 수
     * */
    private long total;

    /**
     * 분류별 상담 인원 수 (예: "비위험군" → 79)
     */
    private Map<String, Long> byCategory;

    /**
     * 최근 3개월간 신규 등록된 상담자 수 (월별)
     */
    private List<MonthlyConsultationDTO> recentRegistrations;
}

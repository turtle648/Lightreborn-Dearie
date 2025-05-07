package com.ssafy.backend.youth_consultation.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MonthlyConsultationDTO {

    /**
     * 해당 월
     */
    private int month;

    /**
     * 해당 월 신규 등록자 수
     * */
    private long count;
}

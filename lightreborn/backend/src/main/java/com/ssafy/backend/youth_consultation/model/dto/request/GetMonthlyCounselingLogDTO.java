package com.ssafy.backend.youth_consultation.model.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.AssertTrue;
import lombok.Getter;

@Getter
public class GetMonthlyCounselingLogDTO {

    @Schema(description = "조회 연도", example = "2025")
    private Integer year;

    @Schema(description = "조회 월 (1~12)", example = "5")
    private Integer month;

    @Schema(description = "일별 조회 (yyyy-MM-dd)", example = "2025-05-24")
    private String date;

    @Schema(description = "페이지 번호", example = "0", defaultValue = "0")
    private int page = 0;

    @Schema(description = "페이지 크기", example = "5", defaultValue = "5")
    private int size = 5;

    @AssertTrue(message = "date가 존재하면 year와 month는 없어야 하며, 그 반대도 마찬가지입니다.")
    @Schema(hidden = true)
    public boolean isValidDateCombination() {
        boolean hasDate = date != null && !date.isBlank();
        boolean hasYearMonth = year != null && month != null;
        return (hasDate && !hasYearMonth) || (!hasDate && hasYearMonth);
    }
}

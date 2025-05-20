package com.ssafy.backend.youth_consultation.model.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class GetMonthlyCounselingLogDTO {

    @Schema(description = "조회 연도, 없으면 조회 당시 년도 기준", example = "2025")
    private Integer year;

    @Schema(description = "페이지 번호", example = "0", defaultValue = "0")
    private int page = 0;

    @Schema(description = "페이지 크기", example = "5", defaultValue = "5")
    private int size = 5;

}

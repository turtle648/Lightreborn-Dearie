package com.ssafy.backend.youth_consultation.model.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;

@Slf4j
@Getter
@ToString
public class AddScheduleRequestDTO {
    @Schema(description = "날짜", example = "2025-05-07")
    private LocalDate date;
}

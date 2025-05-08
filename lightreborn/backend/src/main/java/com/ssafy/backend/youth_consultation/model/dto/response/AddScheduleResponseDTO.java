package com.ssafy.backend.youth_consultation.model.dto.response;

import com.ssafy.backend.youth_consultation.model.entity.CounselingLog;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ToString
@Builder
@Getter
public class AddScheduleResponseDTO {
    private CounselingLog counseling;
}

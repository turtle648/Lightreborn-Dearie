package com.ssafy.backend.youth_consultation.model.dto.response;

import com.ssafy.backend.youth_consultation.model.entity.CounselingLog;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GetCounselingLogResponseDTO {
    private CounselingLog counselingLog;
}

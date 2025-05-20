package com.ssafy.backend.youth_consultation.model.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class IsolationLevelDTO {
    private Integer totalCount;             // 전체 인원
    private Integer nonRiskCount;           // 비위험군
    private Integer atRiskCount;            // 고립 위험군
    private Integer isolatedYouthCount;     // 고립 청년
    private Integer reclusiveYouthCount;    // 은둔 청년
}

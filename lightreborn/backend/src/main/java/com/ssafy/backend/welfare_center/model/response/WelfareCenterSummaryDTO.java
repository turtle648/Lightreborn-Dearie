package com.ssafy.backend.welfare_center.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WelfareCenterSummaryDTO {
    private List<WelfareCenterLocationDTO> locations;                 // 전체 협력기관 위치
    private double averageValue;                                      // 양산시 평균 (청년 인구 1만명당 협력기관 수)
    private List<WelfareCenterYouthStatsDTO> perRegionStats;          // 행정동별 청년 인구 대비 협력기관 현황
    private List<WelfareCenterDetailDTO> details;                     // 전체 협력기관 상세 리스트
    private List<WelfareCenterExportDTO> exportDetails;               // 전체 협력기관 다운로드용 리스트
}

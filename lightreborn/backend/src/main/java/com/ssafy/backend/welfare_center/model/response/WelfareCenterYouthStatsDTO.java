package com.ssafy.backend.welfare_center.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WelfareCenterYouthStatsDTO {
    private Long regionCode;       // 행정동 코드
    private String regionName;     // 행정동 이름
    private Double averageValue;   // 양산시 평균 청년 1만명당 협력기관 수
    private Double regionValue;    // 행정동별 청년 1만명당 협력기관 수
}
package com.ssafy.backend.youth_population.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class YouthRegionDistributionDTO {
    private String region;
    private float perPopulation; // 천 명당 청년 인구 수
}

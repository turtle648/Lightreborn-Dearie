package com.ssafy.backend.youth_population.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class YouthStatsByRegionDTO {
    private String region;
    private Ratio youthPopulationRatio;
    private HouseholdRatio youthSingleHouseholdRatio;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Ratio {
        private String unit; 
        private float value; // 행정동 내 청년 인구 비율
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HouseholdRatio {
        private String unit;
        private float value;
        private float male;
        private float female;
    }
}

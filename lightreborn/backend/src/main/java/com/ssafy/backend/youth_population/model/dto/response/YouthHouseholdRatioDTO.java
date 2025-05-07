package com.ssafy.backend.youth_population.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class YouthHouseholdRatioDTO {
    private Ratio youthSingleHouseholdRatio;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Ratio {
        private String unit;
        private float value;   // 1인가구 비율
        private float male;    // 1인가구 남자 성비
        private float female;  // 1인가구 여자 성비
    }
}

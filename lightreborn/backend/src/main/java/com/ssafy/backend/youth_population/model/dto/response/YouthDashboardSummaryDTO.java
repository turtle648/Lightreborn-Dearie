package com.ssafy.backend.youth_population.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class YouthDashboardSummaryDTO {
    private RatioByAdministrativeDistrict ratioByAdministrativeDistrict;
    private YouthStatsByRegionDTO youthStatsByRegion;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RatioByAdministrativeDistrict {
        private LocalDate baseDate;
        private String unitLabel;
        private List<YouthRegionDistributionDTO> regionData;
        private float maxValue;
        private float minValue;
    }
}
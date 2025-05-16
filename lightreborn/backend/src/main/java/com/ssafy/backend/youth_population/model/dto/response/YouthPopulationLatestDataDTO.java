package com.ssafy.backend.youth_population.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class YouthPopulationLatestDataDTO {
    private String dongName;                  // 행정동 이름
    private String dongCode;                  // 행정동 코드
    private LocalDate baseDate;               // 기준 날짜

    private int youthPopulation;              // 청년 인구 수
    private int maleYouth;                    // 남자 청년 인구 수
    private int femaleYouth;                  // 여자 청년 인구 수

    private int youthOnePersonHousehold;      // 청년 1인 세대 수
    private int maleOnePersonHousehold;       // 남자 청년 1인 세대 수
    private int femaleOnePersonHousehold;     // 여자 청년 1인 세대 수
}

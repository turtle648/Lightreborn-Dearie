package com.ssafy.backend.youth_population.model.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true) //연관관계 필드 설정을 위해 추가
public class YouthPopulationResponseDTO {
    private Long id;
    private Integer youthHouseholdCount;
    private Integer youthMaleHouseholdCount;
    private Integer youthFemaleHouseholdCount;
    private Integer youthPopulation;
    private Integer youthMalePopulation;
    private Integer youthFemalePopulation;
    private LocalDate baseDate;
    private Long hangjungsId;
}
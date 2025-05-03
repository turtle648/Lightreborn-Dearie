package com.ssafy.backend.promotion_network.model.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true) //연관관계 필드 설정을 위해 추가
public class PromotionNetworkResponseDTO {
    private Long id;
    private String address;
    private Float latitude;
    private Float longitude;
    private Boolean isCurrent;
    private LocalDate changedAt;
    private Long hangjungId;
    private Long promotionTypeId;
}
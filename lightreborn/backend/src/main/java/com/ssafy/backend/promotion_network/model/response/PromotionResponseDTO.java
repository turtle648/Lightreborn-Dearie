package com.ssafy.backend.promotion_network.model.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true) //연관관계 필드 설정을 위해 추가
public class PromotionResponseDTO {
    private String placeName;
    private String address;
    private Boolean isPublished;
    private LocalDate createdAt;
    private String promotionType;
    private String promotionPlaceType;
    private Long promotionInformationId;
}
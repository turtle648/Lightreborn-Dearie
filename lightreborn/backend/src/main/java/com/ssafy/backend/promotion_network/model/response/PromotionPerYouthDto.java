package com.ssafy.backend.promotion_network.model.response;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PromotionPerYouthDto {
    private Long dongCode;
    private String dongName;
    private double promotionPerYouth;

    public PromotionPerYouthDto(Long dongCode, String dongName, double promotionPerYouth) {
        this.dongCode = dongCode;
        this.dongName = dongName;
        this.promotionPerYouth = promotionPerYouth;
    }

}
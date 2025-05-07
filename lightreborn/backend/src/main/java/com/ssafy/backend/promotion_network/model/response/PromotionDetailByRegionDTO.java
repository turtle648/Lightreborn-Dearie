package com.ssafy.backend.promotion_network.model.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PromotionDetailByRegionDTO {
    private double promotionPerYouth; // 홍보물 / 청년 인구
    private int youthPopulation; // 청년 인구 수
    private String youthRatio; // 전체 대비 청년 인구 비율
    private int promotionCount; // 총 홍보 거점 수
}
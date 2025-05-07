package com.ssafy.backend.promotion_network.model.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
public class PromotionDetailByRegionDTO {
    private String region; // 행정동 이름
    private Long regionCode; // 행정동 코드
    private double promotionPerYouth; // 홍보물 / 청년 인구
    private int youthPopulation; // 청년 인구 수
    private String youthRatio; // 전체 대비 청년 인구 비율
    private int promotionCount; // 총 홍보 거점 수

    private List<PromotionResponseDTO> promotionList; // 홍보물 목록
    private Map<String, Integer> promotionTypeDistribution; // 홍보물 유형별 개수
}
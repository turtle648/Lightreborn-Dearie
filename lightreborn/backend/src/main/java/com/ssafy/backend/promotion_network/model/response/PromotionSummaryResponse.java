package com.ssafy.backend.promotion_network.model.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class PromotionSummaryResponse {
    private List<PromotionResponseDTO> promotions;
    private Map<String, Double> typeRatio;
    private Double populationPerPromotions;
}
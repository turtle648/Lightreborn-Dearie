package com.ssafy.backend.common.client.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class PlaceCheckResult {
    private boolean success;
    private Map<String, Object> rawResponse;
    private List<Map<String, Object>> places;
    private Map<String, Object> nearestPlace;
    private String placeName;
    private String placeCategory;
    private Double distance;
    private String errorMessage;
}

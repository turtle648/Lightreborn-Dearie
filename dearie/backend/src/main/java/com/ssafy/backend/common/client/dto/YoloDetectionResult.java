package com.ssafy.backend.common.client.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class YoloDetectionResult {
    private String label;
    private double confidence;    // 신뢰도
    private List<Double> box;     // [x1,y1,x2,y2]
}

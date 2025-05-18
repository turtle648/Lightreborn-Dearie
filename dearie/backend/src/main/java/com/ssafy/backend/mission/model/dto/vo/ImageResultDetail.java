package com.ssafy.backend.mission.model.dto.vo;

import com.ssafy.backend.common.client.dto.YoloDetectionResult;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
public class ImageResultDetail {
    private List<YoloDetectionResult> detections;
    private String requiredObjectLabel;
    private boolean isVerified;
}

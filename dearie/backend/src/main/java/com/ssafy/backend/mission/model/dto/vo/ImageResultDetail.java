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
public class ImageResultDetail {

    public ImageResultDetail( List<YoloDetectionResult> detections,
                              String requiredObjectLabel,
                              boolean isVerified,
                              boolean requiredObjectDetected,
                              String s3ImageUrl) {
        this.detections = detections;
        this.requiredObjectLabel = requiredObjectLabel;
        this.isVerified = isVerified;
        this.requiredObjectDetected = requiredObjectDetected;
        this.s3ImageUrl = s3ImageUrl;
    }

    public ImageResultDetail( List<YoloDetectionResult> detections,
                              String requiredObjectLabel,
                              boolean isVerified,
                              String s3ImageUrl) {
        this.detections = detections;
        this.requiredObjectLabel = requiredObjectLabel;
        this.isVerified = isVerified;
        this.requiredObjectDetected = isVerified;
        this.s3ImageUrl = s3ImageUrl;
    }

    private List<YoloDetectionResult> detections;
    private String requiredObjectLabel;
    private boolean requiredObjectDetected;
    private boolean isVerified;
    private String s3ImageUrl;
}

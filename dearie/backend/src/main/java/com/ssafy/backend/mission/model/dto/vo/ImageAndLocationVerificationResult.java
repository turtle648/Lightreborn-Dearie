package com.ssafy.backend.mission.model.dto.vo;

import com.ssafy.backend.common.client.dto.YoloDetectionResult;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ImageAndLocationVerificationResult extends ImageResultDetail {
    public ImageAndLocationVerificationResult(
            List<YoloDetectionResult> detections,
            String requiredObjectLabel,
            boolean isVerified,
            boolean requiredObjectDetected,
            String s3ImageUrl,
            boolean isLocationVerified
    ) {
        super(detections, requiredObjectLabel, isVerified, requiredObjectDetected, s3ImageUrl);
        this.isLocationVerified = isLocationVerified;
    }

    private boolean isLocationVerified;
}

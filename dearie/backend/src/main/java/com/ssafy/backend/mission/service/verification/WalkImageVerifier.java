package com.ssafy.backend.mission.service.verification;

import com.ssafy.backend.common.client.dto.YoloDetectionResult;
import com.ssafy.backend.mission.model.dto.request.MissionCompletionRequestDTO;
import com.ssafy.backend.mission.model.dto.vo.ImageResultDetail;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
public class WalkImageVerifier implements ImageVerifier {
    @Override
    public ImageResultDetail verify(MissionCompletionRequestDTO request, String imageUrl, List<YoloDetectionResult> detections) {
        log.info("산책 이미지 검증 시작");

        boolean isWalkDetected = detections.stream()
                .anyMatch(obj -> obj.getLabel().equalsIgnoreCase("flower") ||
                        obj.getLabel().equalsIgnoreCase("leaves") ||
                        obj.getLabel().equalsIgnoreCase("bench") &&
                        obj.getConfidence() > CONFIDENCE_THRESHOLD);

        log.info("산책 검증 결과: {}", isWalkDetected);

        return new ImageResultDetail(detections, request.getImageKeyword(), isWalkDetected, imageUrl);
    }

    @Override
    public boolean canHandle(String keyword) {
        return "flower".equalsIgnoreCase(keyword) || "leaves".equalsIgnoreCase(keyword) || "bench".equalsIgnoreCase(keyword);
    }
}

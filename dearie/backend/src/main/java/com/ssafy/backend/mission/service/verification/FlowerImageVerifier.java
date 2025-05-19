package com.ssafy.backend.mission.service.verification;

import com.ssafy.backend.common.client.dto.YoloDetectionResult;
import com.ssafy.backend.mission.model.dto.request.MissionCompletionRequestDTO;
import com.ssafy.backend.mission.model.dto.vo.ImageResultDetail;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
public class FlowerImageVerifier implements ImageVerifier {

    @Override
    public ImageResultDetail verify(MissionCompletionRequestDTO request, String imageUrl, List<YoloDetectionResult> detections) {
        log.info("꽃 이미지 검증 시작");

        boolean isFlowerDetected = detections.stream()
                .anyMatch(obj -> obj.getLabel().equalsIgnoreCase("flower") &&
                        obj.getConfidence() > 0.5f);

        log.info("꽃 검증 결과: {}", isFlowerDetected);

        return new ImageResultDetail(detections, request.getImageKeyword(), isFlowerDetected, imageUrl);
    }

    @Override
    public boolean canHandle(String keyword) {
        return "flower".equalsIgnoreCase(keyword);
    }
}

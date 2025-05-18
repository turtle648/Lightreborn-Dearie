package com.ssafy.backend.mission.service.verification;

import com.ssafy.backend.common.client.dto.YoloDetectionResult;
import com.ssafy.backend.mission.model.dto.request.MissionCompletionRequestDTO;
import com.ssafy.backend.mission.model.dto.vo.ImageResultDetail;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
public class ParkImageVerifier implements ImageVerifier {
    @Override
    public ImageResultDetail verify(MissionCompletionRequestDTO request, String imageUrl, List<YoloDetectionResult> detections) {
        log.info("공원이미지 검증 시작");

        // 공원 벤치 객체 검증
        boolean isBenchDetected = detections.stream()
                .anyMatch(obj -> obj.getLabel().equalsIgnoreCase("bench") &&
                        obj.getConfidence() > 0.5);

        log.info("벤치 객체 검증 결과: {}", isBenchDetected);

        return new ImageResultDetail(detections, request.getImageKeyword(), isBenchDetected);
    }

    @Override
    public boolean canHandle(String keyword) {
        return "park".equalsIgnoreCase(keyword);
    }
}

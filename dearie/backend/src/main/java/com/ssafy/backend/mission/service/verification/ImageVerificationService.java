package com.ssafy.backend.mission.service.verification;

import com.ssafy.backend.common.client.dto.YoloDetectionResult;
import com.ssafy.backend.mission.model.dto.request.MissionCompletionRequestDTO;
import com.ssafy.backend.mission.model.dto.vo.ImageResultDetail;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImageVerificationService {
    private final Set<ImageVerifier> verifiers;

    /**
     * 이미지 키워드에 맞는 검증 수행
     */
    public ImageResultDetail verifyImage(MissionCompletionRequestDTO request, String imageUrl, List<YoloDetectionResult> detections) {
        String imageKeyword = request.getImageKeyword();

        // 적절한 검증기 찾기
        ImageVerifier verifier = verifiers.stream()
                .filter(v -> v.canHandle(imageKeyword))
                .findFirst()
                .orElse(new DefaultImageVerifier());

        log.info("이미지 키워드 [{}]에 대한 검증기 선택: {}", imageKeyword, verifier.getClass().getSimpleName());

        // 검증 수행
        return verifier.verify(request, imageUrl, detections);
    }
     /**
     * 기본 검증기 (특정 키워드에 맞는 검증기가 없을 때 사용)
     */
    private class DefaultImageVerifier implements ImageVerifier {
        @Override
        public ImageResultDetail verify(MissionCompletionRequestDTO request, String imageUrl, List<YoloDetectionResult> detections) {
            log.info("기본 이미지 검증 수행");

            // YOLO 결과에서 키워드와 일치하는 객체가 있는지 확인
            boolean isDetected = detections.stream()
                    .anyMatch(obj -> obj.getLabel().equalsIgnoreCase(request.getImageKeyword()) &&
                            obj.getConfidence() > 0.5);

            return new ImageResultDetail(detections, request.getImageKeyword(), isDetected);
        }

        @Override
        public boolean canHandle(String keyword) {
            return true; // 항상 처리 가능 (기본 검증기)
        }
    }
}

package com.ssafy.backend.mission.service.verification;

import com.ssafy.backend.common.client.dto.YoloDetectionResult;
import com.ssafy.backend.mission.model.dto.request.MissionCompletionRequestDTO;
import com.ssafy.backend.mission.model.dto.vo.ImageResultDetail;

import java.util.List;

public interface ImageVerifier {
    ImageResultDetail verify(MissionCompletionRequestDTO request, String imageUrl, List<YoloDetectionResult> detections);
    boolean canHandle(String keyword);
}

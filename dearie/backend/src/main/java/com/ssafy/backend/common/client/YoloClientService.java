package com.ssafy.backend.common.client;

import com.ssafy.backend.common.client.dto.YoloDetectionResult;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class YoloClientService {

    private final WebClient yoloWebClient;

    public Mono<List<YoloDetectionResult>> detectImage(Long missionId, String imageUrl) {
        return yoloWebClient.post()
                .uri("/api/app/missions/{missionId}/completions", missionId)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(Map.of("image_url", imageUrl))
                .retrieve()
                .bodyToFlux(YoloDetectionResult.class)   // 1개 검출당 DetectedObject
                .collectList();                     // 전체 리스트로 묶어서 반환
    }
}

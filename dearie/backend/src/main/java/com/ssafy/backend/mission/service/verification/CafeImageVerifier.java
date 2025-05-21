package com.ssafy.backend.mission.service.verification;

import com.ssafy.backend.common.client.GeoSearchService;
import com.ssafy.backend.common.client.dto.PlaceCheckResult;
import com.ssafy.backend.common.client.dto.YoloDetectionResult;
import com.ssafy.backend.mission.model.dto.request.MissionCompletionRequestDTO;
import com.ssafy.backend.mission.model.dto.vo.ImageAndLocationVerificationResult;
import com.ssafy.backend.mission.model.dto.vo.ImageResultDetail;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class CafeImageVerifier implements ImageVerifier {

    private final GeoSearchService geoSearchService;
    private static final int SEARCH_RADIUS = 50;

    @Override
    public ImageAndLocationVerificationResult verify(MissionCompletionRequestDTO request, String imageUrl, List<YoloDetectionResult> detections) {
        log.info("카페 이미지 검증 시작");

        boolean isLocationVerified = false;
        boolean isCupDetected = false;

        // 1. 위치 정보 검증 - 카페인지 확인
        if (request.getLatitude() != null && request.getLongitude() != null) {
            try {
                // 카페 키워드로 검색하거나 카페 카테고리 코드(CE7)로 검색
                PlaceCheckResult placeResult = geoSearchService.searchByCategory("CE7",  request.getLongitude(), request.getLatitude(), SEARCH_RADIUS, 1, 5)
                        .flatMap(result -> {
                            List<Map<String, Object>> documents = (List<Map<String, Object>>) result.get("documents");

                            if (documents != null && !documents.isEmpty()) {
                                return Mono.just(processKakaoResult(documents));
                            }
                            else{
                                return geoSearchService.searchByKeyword("카페", request.getLongitude(), request.getLatitude(), SEARCH_RADIUS, 1, 5)
                                        .map(keywordResult -> {
                                            List<Map<String, Object>> keywordDocuments =
                                                    (List<Map<String, Object>>) keywordResult.get("documents");
                                            return processKakaoResult(keywordDocuments);
                                        });
                            }
                        }).block();

                if (placeResult != null && placeResult.isSuccess()) {
                    // 검색 결과가 있고, 거리가 Search Radius 이내인 경우 성공
                    if (placeResult.getDistance() != null && placeResult.getDistance() <= SEARCH_RADIUS) {
                        isLocationVerified = true;
                        log.info("카페 위치 검증 성공. 장소명: {}, 카테고리: {}, 거리: {}m",
                                placeResult.getPlaceName(),
                                placeResult.getPlaceCategory(),
                                placeResult.getDistance());
                    } else {
                        log.info("카페 위치 검증 실패. 가장 가까운 카페가 {}m 떨어져 있습니다.", placeResult.getDistance());
                    }
                } else {
                    log.info("카페 위치 검증 실패. 주변에 카페를 찾을 수 없습니다.");
                }
            } catch (Exception e) {
                log.error("카페 위치 검증 중 오류 발생", e);
            }
        } else {
            log.info("위치 정보가 제공되지 않았습니다.");
        }

        // 2. 컵 객체 검증
        isCupDetected = detections.stream()
                .anyMatch(obj -> (obj.getLabel().equalsIgnoreCase("cup") ||
                        obj.getLabel().equalsIgnoreCase("mug") ||
                        obj.getLabel().equalsIgnoreCase("coffee")) &&
                        obj.getConfidence() > CONFIDENCE_THRESHOLD);

        log.info("컵/커피 객체 검증 결과: {}", isCupDetected);

        // 최종 검증 결과 - 위치가 카페이고 컵이 감지되어야 함
        boolean isVerified = isLocationVerified && isCupDetected;
        log.info("카페 미션 최종 검증 결과: {}", isVerified);

        return new ImageAndLocationVerificationResult(detections, request.getImageKeyword(), isVerified, isCupDetected, imageUrl, isLocationVerified);
    }

    /**
     * 카카오 API 결과를 PlaceCheckResult로 변환
     */
    private PlaceCheckResult processKakaoResult(List<Map<String, Object>> documents) {
        PlaceCheckResult result = new PlaceCheckResult();

        boolean hasPlaces = documents != null && !documents.isEmpty();
        result.setSuccess(hasPlaces);

        if (hasPlaces) {
            result.setPlaces(documents);

            // 첫 번째 결과 (가장 가까운 장소)
            Map<String, Object> place = documents.get(0);
            result.setNearestPlace(place);
            result.setPlaceName((String) place.get("place_name"));
            result.setPlaceCategory((String) place.get("category_name"));

            // 거리 정보 파싱
            if (place.containsKey("distance")) {
                try {
                    result.setDistance(Double.parseDouble((String) place.get("distance")));
                } catch (NumberFormatException e) {
                    log.error("거리 정보 파싱 오류", e);
                }
            }
        }

        return result;
    }

    @Override
    public boolean canHandle(String keyword) {
        return "CAFE".equalsIgnoreCase(keyword) ||
                "카페".equals(keyword) ||
                "커피".equals(keyword) ||
                "coffee".equalsIgnoreCase(keyword);
    }
}
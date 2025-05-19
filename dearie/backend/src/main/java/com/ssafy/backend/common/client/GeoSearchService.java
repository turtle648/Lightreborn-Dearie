package com.ssafy.backend.common.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class GeoSearchService {

    private final WebClient kakaoWebClient;

    /**
     * 키워드로 장소 검색
     * @param keyword 검색 키워드
     * @param x 중심 경도 (기준점)
     * @param y 중심 위도 (기준점)
     * @param radius 검색 반경 (미터)
     * @param page 결과 페이지 번호
     * @param size 한 페이지당 결과 수
     * @return 검색 결과
     */
    public Mono<Map> searchByKeyword(String keyword, Double x, Double y, Integer radius, Integer page, Integer size) {
        return kakaoWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v2/local/search/keyword.json")
                        .queryParam("query", keyword)
                        .queryParamIfPresent("x", java.util.Optional.ofNullable(x))
                        .queryParamIfPresent("y", java.util.Optional.ofNullable(y))
                        .queryParamIfPresent("radius", java.util.Optional.ofNullable(radius))
                        .queryParam("page", page != null ? page : 1)
                        .queryParam("size", size != null ? size : 15)
                        .build())
                .retrieve()
                .bodyToMono(Map.class);
    }

    /**
     * 카테고리로 장소 검색
     * @param categoryGroupCode 카테고리 그룹 코드
     * @param x 중심 경도
     * @param y 중심 위도
     * @param radius 검색 반경 (미터)
     * @param page 결과 페이지 번호
     * @param size 한 페이지당 결과 수
     * @return 검색 결과
     */
    public Mono<Map> searchByCategory(String categoryGroupCode, Double x, Double y, Integer radius, Integer page, Integer size) {
        String apiKey = "53ba64d73976935d1286d226089381ff";
        log.info("Kakao API Key for request: {}", apiKey);
        return kakaoWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v2/local/search/category.json")
                        .queryParam("category_group_code", categoryGroupCode)
                        .queryParam("x", x)
                        .queryParam("y", y)
                        .queryParamIfPresent("radius", java.util.Optional.ofNullable(radius))
                        .queryParam("page", page != null ? page : 1)
                        .queryParam("size", size != null ? size : 15)
                        .build())
                .retrieve()
                .bodyToMono(Map.class);
    }
}

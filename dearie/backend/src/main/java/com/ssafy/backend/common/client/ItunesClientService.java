package com.ssafy.backend.common.client;

import com.ssafy.backend.common.client.dto.ItunesResult;
import com.ssafy.backend.common.client.dto.ItunesSearchResponse;
import com.ssafy.backend.mission.model.dto.vo.MusicResultDetail;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class ItunesClientService {

    private final WebClient itunesWebClient;

    /**
     * 제목+가수 이름으로 iTunes 에 검색을 보내고,
     * 결과가 있으면 첫 번째 곡의 artworkUrl100(썸네일)을 리턴.
     */
    public String fetchThumbnailUrl(String title, String artist) {
        // 1) 검색어 조합: "artist title" 순으로
        String term = artist + " " + title;

        ItunesSearchResponse resp = itunesWebClient.get()
                .uri(uri -> uri
                        .path("/search")
                        .queryParam("term", term)
                        .queryParam("media", "music")
                        .queryParam("entity", "song")
                        .queryParam("limit", 1)
                        .build()
                )
                .retrieve()
                .bodyToMono(ItunesSearchResponse.class)
                .block();

        if (resp != null && resp.getResultCount() > 0) {
            ItunesResult result = resp.getResults().get(0);
            return result.getArtworkUrl100();
        }

        // 검색 실패 시 기본 이미지 URL 리턴하거나 빈 문자열
        return "";
    }
}

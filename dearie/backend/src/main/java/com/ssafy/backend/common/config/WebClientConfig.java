package com.ssafy.backend.common.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.apache.http.HttpHeaders;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Value("${KAKAO_REST_API_KEY}")
    private String apiKey;

    @Bean
    public WebClient openAiWebClient(
            @Value("${openai.api.key}") String apiKey,
            @Value("${openai.api-base-url}") String baseUrl            ) {
        return WebClient.builder()
            .baseUrl(baseUrl)
            .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();
    }

    @Bean
    @Qualifier("itunesWebClient")
    public WebClient itunesWebClient(WebClient.Builder webClientBuilder) {
        return webClientBuilder
                .baseUrl("https://itunes.apple.com")
                .build();
    }

    @Bean
    @Qualifier("kakaoWebClient")
    public WebClient kakaoWebClient(WebClient.Builder webClientBuilder) {
        return WebClient.builder()
                .baseUrl("https://dapi.kakao.com")
                .defaultHeader("Authorization", "KakaoAK " + apiKey)
                .build();
    }

}
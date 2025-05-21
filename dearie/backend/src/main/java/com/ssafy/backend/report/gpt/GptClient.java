package com.ssafy.backend.report.gpt;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;

@Component
@RequiredArgsConstructor
public class GptClient {

    @Value("${openai.api.key}")
    private String apiKey;

    private final ObjectMapper objectMapper;

    public GptResult callGpt(String prompt) {
        WebClient webClient = WebClient.builder()
                .baseUrl("https://api.openai.com/v1/chat/completions")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-3.5-turbo");
        requestBody.put("messages", List.of(
                Map.of("role", "user", "content", prompt)
        ));
        requestBody.put("temperature", 1.1);

        String response = webClient.post()
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        System.out.println("GPT 원본 응답: " + response);

        try {
            JsonNode root = objectMapper.readTree(response);
            String content = root.path("choices").get(0).path("message").path("content").asText();
            JsonNode contentNode = objectMapper.readTree(content);
            String summary = contentNode.path("summary").asText();
            String comment = contentNode.path("comment").asText();
            Map<String, Integer> emotionScores = new HashMap<>();
            JsonNode scoresNode = contentNode.path("emotionScores");
            for (String emotion : List.of("기쁨", "슬픔", "분노", "불안", "평온")) {
                if (scoresNode.has(emotion)) {
                    emotionScores.put(emotion, scoresNode.get(emotion).asInt());
                }
            }

            return GptResult.builder()
                    .summary(summary)
                    .comment(comment)
                    .emotionScores(emotionScores)
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("GPT 응답 파싱 실패", e);
        }
    }

    private String extractSection(String content, int sectionNumber) {
        return Arrays.stream(content.split("\n"))
                .filter(line -> line.startsWith(sectionNumber + "."))
                .map(line -> line.replaceFirst("^\\d+\\.\\s*", "").trim())
                .findFirst()
                .orElse("");
    }

    private Map<String, Integer> extractEmotionScoreJson(String content) {
        int start = content.indexOf("{");
        int end = content.indexOf("}", start);
        if (start == -1 || end == -1) return Collections.emptyMap();

        try {
            String json = content.substring(start, end + 1);
            JsonNode node = objectMapper.readTree(json);
            Map<String, Integer> scores = new HashMap<>();
            for (String emotion : List.of("기쁨", "슬픔", "분노", "불안", "평온")) {
                if (node.has(emotion)) {
                    scores.put(emotion, node.get(emotion).asInt());
                }
            }
            return scores;
        } catch (Exception e) {
            return Collections.emptyMap();
        }
    }
}

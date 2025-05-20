package com.ssafy.backend.report.gpt;

import lombok.Builder;
import lombok.Getter;

import java.util.Map;

@Getter
@Builder
public class GptResult {
    private String summary;
    private String comment;
    private Map<String, Integer> emotionScores;
}
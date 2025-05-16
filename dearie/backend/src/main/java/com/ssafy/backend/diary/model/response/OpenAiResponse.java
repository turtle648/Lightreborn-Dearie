package com.ssafy.backend.diary.model.response;

import com.ssafy.backend.diary.model.request.OpenAiMessage;
import lombok.Data;

import java.util.List;

@Data
public class OpenAiResponse {
    private List<Choice> choices;

    @Data
    public static class Choice {
        private OpenAiMessage message;
    }
}
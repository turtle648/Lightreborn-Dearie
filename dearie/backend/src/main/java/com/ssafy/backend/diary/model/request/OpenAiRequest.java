package com.ssafy.backend.diary.model.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OpenAiRequest {
    private String model;
    private List<OpenAiMessage> messages;
    private double temperature;
    private int max_tokens;
}
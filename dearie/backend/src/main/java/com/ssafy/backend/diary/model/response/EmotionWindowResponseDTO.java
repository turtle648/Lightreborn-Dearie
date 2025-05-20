package com.ssafy.backend.diary.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class EmotionWindowResponseDTO {
    private String path;

    public static EmotionWindowResponseDTO from (String path) {
        return new EmotionWindowResponseDTO(path);
    }
}

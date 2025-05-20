package com.ssafy.backend.diary.model.dto.response;

import com.ssafy.backend.diary.model.entity.EmotionTag;
import com.ssafy.backend.diary.model.state.EmotionType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EmotionTagDTO {
    private String tag; // 한글 감정 태그명
    private String english; // 영문 enum 값

    public static EmotionTagDTO fromEntity(EmotionTag emotionTag) {
         // 한글 → enum 변환
        EmotionType type = EmotionType.fromKorean(emotionTag.getTag());
        return EmotionTagDTO.builder()
                .tag(type.getKorean())
                .english(type.name())
                .build();
    }
}

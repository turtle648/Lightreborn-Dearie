package com.ssafy.backend.diary.util;

import com.ssafy.backend.diary.model.state.EmotionType;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class EmotionMapper {
    private static final Map<EmotionType, String> EMOTION_GROUP_MAP = new HashMap<>();
    static {
        EMOTION_GROUP_MAP.put(EmotionType.JOY, "기쁨");
        EMOTION_GROUP_MAP.put(EmotionType.EXCITEMENT, "기쁨");
        EMOTION_GROUP_MAP.put(EmotionType.GRATITUDE, "기쁨");

        EMOTION_GROUP_MAP.put(EmotionType.SADNESS, "슬픔");

        EMOTION_GROUP_MAP.put(EmotionType.ANGER, "분노");

        EMOTION_GROUP_MAP.put(EmotionType.ANXIETY, "불안");
        EMOTION_GROUP_MAP.put(EmotionType.BOREDOM, "불안");
        EMOTION_GROUP_MAP.put(EmotionType.SURPRISE, "불안");
        EMOTION_GROUP_MAP.put(EmotionType.CONFUSION, "불안");
        EMOTION_GROUP_MAP.put(EmotionType.FATIGUE, "불안");

        EMOTION_GROUP_MAP.put(EmotionType.CALM, "평온");
        EMOTION_GROUP_MAP.put(EmotionType.HOPE, "평온");
    }

    public static Map<String, Integer> mapToMainEmotions(List<EmotionType> tags) {
        Map<String, Integer> result = new HashMap<>();
        for (EmotionType tag : tags) {
            String mainEmotion = EMOTION_GROUP_MAP.get(tag);
            result.put(mainEmotion, result.getOrDefault(mainEmotion, 0) + 1);
        }
        return result;
    }
}

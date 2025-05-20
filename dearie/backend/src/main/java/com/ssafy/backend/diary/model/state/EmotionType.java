package com.ssafy.backend.diary.model.state;

import com.ssafy.backend.diary.model.entity.Diary;

public enum EmotionType {
    JOY("기쁨"),        
    SADNESS("슬픔"),    
    ANGER("분노"),      
    ANXIETY("불안"),   
    CALM("평온"),       
    BOREDOM("지루함"),   
    EXCITEMENT("설렘"), 
    GRATITUDE("감사"), 
    SURPRISE("놀람"),   
    CONFUSION("혼란"),  
    HOPE("희망"),       
    FATIGUE("피곤");    

    private final String korean;

    EmotionType(String korean) {
        this.korean = korean;
    }

    public String getKorean() {
        return korean;
    }

    // 한글 변환
    public static EmotionType fromKorean(String korean) {
        for (EmotionType type : values()) {
        System.out.println("enum: " + type.korean + ", input: " + korean);
        if (type.korean.equals(korean)) {
            return type;
        }
    }
    throw new IllegalArgumentException("Unknown emotion: " + korean);
    }

    public static boolean getEmotionPolarity(Diary.EmotionTag emotionTag) {
        EmotionType type;
        try {
            type = EmotionType.valueOf(emotionTag.name());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("존재하지 않는 감정 태그입니다: " + emotionTag);
        }

        return switch (type) {
            case JOY, CALM, EXCITEMENT, GRATITUDE, HOPE -> true;
            case SADNESS, ANGER, ANXIETY, FATIGUE, CONFUSION, BOREDOM -> false;
            default -> throw new IllegalArgumentException("감정 극성을 판단할 수 없습니다: " + emotionTag);
        };
    }
}

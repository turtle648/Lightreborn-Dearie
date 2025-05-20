package com.ssafy.backend.diary.model.state;

import com.ssafy.backend.diary.model.entity.Diary;
import com.ssafy.backend.diary.model.entity.EmotionScore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Getter
@AllArgsConstructor
@Slf4j
public enum EmotionWindow {
    MORNING("아침", "./images/morning_window.gif"),
    NIGHT("저녁", "./images/night_window.gif");

    private String label;
    private String path;

    public static EmotionWindow from (Diary diary) {
        if(diary == null || diary.getEmotionTag() == null) {
            return MORNING;
        }

        log.info("EmotionWindow: {}", diary);

        return EmotionType.getEmotionPolarity(diary.getEmotionTag()) ? MORNING : NIGHT;
    }
}

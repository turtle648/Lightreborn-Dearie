package com.ssafy.backend.diary.model.request;

import com.ssafy.backend.diary.model.entity.Diary;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateDiaryRequestDTO {
    private String content;
    private Diary.EmotionTag emotionTag;
}

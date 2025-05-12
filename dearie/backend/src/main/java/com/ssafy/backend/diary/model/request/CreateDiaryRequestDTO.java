package com.ssafy.backend.diary.model.request;

import com.ssafy.backend.diary.model.entity.Diary.EmotionTag;
import com.ssafy.backend.diary.model.entity.DiaryImage;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateDiaryRequestDTO {
    private String content;
    private EmotionTag emotionTag;
}

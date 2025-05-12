package com.ssafy.backend.diary.model.request;

import com.ssafy.backend.diary.model.entity.Diary.EmotionTag;
import com.ssafy.backend.diary.model.entity.DiaryImage;
import lombok.Getter;

import java.util.List;

@Getter
public class CreateDiaryRequestDTO {
    private String content;
    private Long userId;
}

package com.ssafy.backend.diary.model.response;

import com.ssafy.backend.diary.model.entity.Diary;

import java.util.List;

public record DiaryListItemDto(
    Long diaryId,
    Diary.EmotionTag emotionTag,
    String content,
    String date,
    List<String> images,
    Boolean isBookmarked
) {}
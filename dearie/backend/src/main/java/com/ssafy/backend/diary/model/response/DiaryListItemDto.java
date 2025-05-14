package com.ssafy.backend.diary.model.response;

import java.util.List;

public record DiaryListItemDto(
    Long diaryId,
    String content,
    String date,
    List<String> images
) {}
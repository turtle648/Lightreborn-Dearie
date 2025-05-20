package com.ssafy.backend.diary.reader;

public interface DiaryReader {
    Integer getCountByUserId (Long userId);
    Integer getCountConsecutiveDiaryDays (Long userId);
}

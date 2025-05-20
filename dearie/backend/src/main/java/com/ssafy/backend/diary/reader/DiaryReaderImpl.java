package com.ssafy.backend.diary.reader;

import com.ssafy.backend.diary.repository.DiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DiaryReaderImpl implements DiaryReader {

    private final DiaryRepository diaryRepository;

    @Override
    public Integer getCountByUserId(Long userId) {
        return diaryRepository.countByUserId(userId);
    }

    @Override
    public Integer getCountConsecutiveDiaryDays(Long userId) {
        return diaryRepository.countConsecutiveDiaryDays(userId);
    }
}

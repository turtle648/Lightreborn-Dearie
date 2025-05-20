package com.ssafy.backend.diary.reader;

import com.ssafy.backend.diary.model.entity.Diary;
import com.ssafy.backend.diary.repository.DiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DiaryReaderImpl implements DiaryReader {

    private final DiaryRepository diaryRepository;

    @Override
    public Integer getCountByUserId(Long userId) {
        return diaryRepository.countByUser_id(userId);
    }

    @Override
    public Integer getCountConsecutiveDiaryDays(Long userId) {
        return diaryRepository.countConsecutiveDiaryDays(userId);
    }
}

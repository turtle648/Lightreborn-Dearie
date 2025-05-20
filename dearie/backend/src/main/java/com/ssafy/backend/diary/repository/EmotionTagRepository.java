package com.ssafy.backend.diary.repository;

import com.ssafy.backend.diary.model.entity.EmotionTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmotionTagRepository extends JpaRepository<EmotionTag, Long> {
    List<EmotionTag> findByDiaryId(Long diaryId);

    List<EmotionTag> findByDiaryIdIn(List<Long> diaryIds);
}
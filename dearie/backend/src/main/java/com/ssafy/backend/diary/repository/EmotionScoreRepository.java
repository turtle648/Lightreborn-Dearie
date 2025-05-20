package com.ssafy.backend.diary.repository;

import com.ssafy.backend.diary.model.entity.EmotionScore;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmotionScoreRepository extends JpaRepository<EmotionScore, Long> {

}
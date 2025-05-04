package com.ssafy.backend.youth_consultation.repository;

import com.ssafy.backend.youth_consultation.entity.SurveyQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SurveyQuestionRepository extends JpaRepository<SurveyQuestion, Long> {
    List<SurveyQuestion> findAll();
}

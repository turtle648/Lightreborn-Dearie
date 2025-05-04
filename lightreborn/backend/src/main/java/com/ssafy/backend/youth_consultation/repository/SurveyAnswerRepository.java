package com.ssafy.backend.youth_consultation.repository;

import com.ssafy.backend.youth_consultation.entity.SurveyAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SurveyAnswerRepository extends JpaRepository<SurveyAnswer, Long> {
}

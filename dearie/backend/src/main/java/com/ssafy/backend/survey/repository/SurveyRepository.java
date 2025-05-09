package com.ssafy.backend.survey.repository;

import com.ssafy.backend.survey.entity.Survey;
import com.ssafy.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SurveyRepository extends JpaRepository<Survey, Long> {
}

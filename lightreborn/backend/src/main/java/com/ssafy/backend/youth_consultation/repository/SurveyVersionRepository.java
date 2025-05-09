package com.ssafy.backend.youth_consultation.repository;

import com.ssafy.backend.youth_consultation.model.entity.PersonalInfo;
import com.ssafy.backend.youth_consultation.model.entity.SurveyVersion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SurveyVersionRepository extends JpaRepository<SurveyVersion, Long> {
    Optional<SurveyVersion> findById(Long id);

    @EntityGraph(attributePaths = "scaleScores")
    Optional<SurveyVersion> findTopByPersonalInfoOrderByVersionDesc(@Param("personalInfo") PersonalInfo personalInfo);


    @EntityGraph(attributePaths = "scaleScores")
    Page<SurveyVersion> findAllByPersonalInfo(PersonalInfo personalInfo, Pageable pageable);
}

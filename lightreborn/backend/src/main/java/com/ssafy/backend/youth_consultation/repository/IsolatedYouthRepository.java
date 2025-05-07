package com.ssafy.backend.youth_consultation.repository;

import com.ssafy.backend.youth_consultation.model.entity.IsolatedYouth;
import com.ssafy.backend.youth_consultation.model.entity.SurveyProcessStep;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface IsolatedYouthRepository extends JpaRepository<IsolatedYouth, Long> {
    Optional<IsolatedYouth> findById(Long Id);
    Page<IsolatedYouth> findBySurveyProcessStep(SurveyProcessStep surveyProcessStep, Pageable pageable);
    @Query("""
        SELECT i FROM IsolatedYouth i
        WHERE i.surveyProcessStep = :step
        AND i.personalInfo.name LIKE %:name%
    """)
    Page<IsolatedYouth> findBySurveyProcessStepAndName(
            @Param("step") SurveyProcessStep step,
            @Param("name") String name,
            Pageable pageable
    );
}

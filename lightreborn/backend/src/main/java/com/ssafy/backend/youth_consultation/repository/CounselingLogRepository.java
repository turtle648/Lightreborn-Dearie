package com.ssafy.backend.youth_consultation.repository;

import com.ssafy.backend.youth_consultation.model.entity.CounselingLog;
import com.ssafy.backend.youth_consultation.model.entity.IsolatedYouth;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface CounselingLogRepository extends JpaRepository<CounselingLog, Long> {
    @EntityGraph(attributePaths = {"isolatedYouth", "isolatedYouth.personalInfo"})
    Optional<CounselingLog> findById(Long id);

    @EntityGraph(attributePaths = {"isolatedYouth", "isolatedYouth.personalInfo"})
    Page<CounselingLog> findAll(Pageable pageable);

    Page<CounselingLog> findAllByIsolatedYouth(IsolatedYouth isolatedYouth, Pageable pageable);

    @EntityGraph(attributePaths = {"isolatedYouth", "isolatedYouth.personalInfo"})
    Page<CounselingLog> findAllByConsultationDateBetween(LocalDateTime start, LocalDateTime end, Pageable pageable);
}

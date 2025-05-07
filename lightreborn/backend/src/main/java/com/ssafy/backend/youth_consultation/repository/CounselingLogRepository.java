package com.ssafy.backend.youth_consultation.repository;

import com.ssafy.backend.youth_consultation.model.entity.CounselingLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CounselingLogRepository extends JpaRepository<CounselingLog, Long> {
    Optional<CounselingLog> findById(Long id);
}

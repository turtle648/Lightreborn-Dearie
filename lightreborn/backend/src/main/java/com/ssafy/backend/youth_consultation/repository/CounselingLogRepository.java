package com.ssafy.backend.youth_consultation.repository;

import com.ssafy.backend.youth_consultation.model.entity.CounselingLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CounselingLogRepository extends JpaRepository<CounselingLog, Long> {
}

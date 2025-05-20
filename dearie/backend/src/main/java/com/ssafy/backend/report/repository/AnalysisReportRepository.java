package com.ssafy.backend.report.repository;

import com.ssafy.backend.report.model.entity.AnalysisReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;


@Repository
public interface AnalysisReportRepository extends JpaRepository<AnalysisReport, Long> {
    // 특정 유저의 특정 주차 리포트 조회
    Optional<AnalysisReport> findByUserIdAndAnalysisWeekDate(Long userId, LocalDateTime analysisWeekDate);
}

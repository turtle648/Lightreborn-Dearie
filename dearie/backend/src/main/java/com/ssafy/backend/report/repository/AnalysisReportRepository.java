package com.ssafy.backend.report.repository;

import com.ssafy.backend.report.model.entity.AnalysisReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface AnalysisReportRepository extends JpaRepository<AnalysisReport, Long> {

}

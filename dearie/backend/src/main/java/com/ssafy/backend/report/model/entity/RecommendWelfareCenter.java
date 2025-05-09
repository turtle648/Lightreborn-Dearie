package com.ssafy.backend.report.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recommend_welfare_center",
       uniqueConstraints = @UniqueConstraint(columnNames = {"analysis_report_id","welfare_center_id"}))
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class RecommendWelfareCenter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어느 보고서에 대한 추천인지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "analysis_report_id", nullable = false)
    private AnalysisReport analysisReport;

    // 추천된 복지관
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "welfare_center_id", nullable = false)
    private WelfareCenter welfareCenter;
}

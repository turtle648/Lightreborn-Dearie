package com.ssafy.backend.report.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recommend_action")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class RecommendAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 추천 활동명
    @Column(name = "action_name", nullable = false, length = 100)
    private String actionName;

    // 관련 주소 (예: 장소 위치 등)
    @Column(length = 255, columnDefinition = "text")
    private String address;

    // 상세 설명
    @Column(length = 255, columnDefinition = "text")
    private String detail;

    // 어느 분석 보고서에 대한 추천인지 (N:1)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "analysis_report_id", nullable = false)
    private AnalysisReport analysisReport;
}

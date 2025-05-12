package com.ssafy.backend.report.model.entity;

import com.ssafy.backend.diary.model.entity.EmotionScore;
import com.ssafy.backend.auth.model.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "analysis_report")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class AnalysisReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 분석 일자 (week 단위)
    @Column(name = "analysis_week_date", nullable = false)
    private LocalDateTime analysisWeekDate;

    // AI 코멘트(총평)
    @Column(nullable = false, columnDefinition = "text")
    private String comment;

    // 일주일간 감정 점수 엔터티 (1:1)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emotion_score_id", nullable = false)
    private EmotionScore emotionScore;

    // 보고서 작성한 유저 (N:1)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}

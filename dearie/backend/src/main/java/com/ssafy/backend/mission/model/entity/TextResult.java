package com.ssafy.backend.mission.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "text_results")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
public class TextResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String content;

    @Column(name = "created_at", nullable = false, updatable = false,
            columnDefinition = "TIMESTAMP DEFAULT NOW()")
    private LocalDateTime createdAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mission_result_id", unique = true)
    private MissionResult missionResult;

    @PrePersist
    private void prePersist() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
    }

    public static TextResult of(MissionResult mr, String content) {
        return TextResult.builder()
                .missionResult(mr)
                .content(content)
                .build();
    }
}

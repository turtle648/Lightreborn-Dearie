package com.ssafy.backend.mission.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "music_results")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
public class MusicResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String singer;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(length = 200)
    private String thumbnail;

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

    public static MusicResult of(MissionResult mr, String singer, String title, String thumbnail) {
        return MusicResult.builder()
                .missionResult(mr)
                .singer(singer)
                .title(title)
                .thumbnail(thumbnail)
                .build();
    }
}

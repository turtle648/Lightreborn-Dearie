package com.ssafy.backend.mission.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Duration;
import java.time.LocalDateTime;

@Entity
@Table(name = "walk_results")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
public class WalkResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false)
    private Duration duration;

    // 산책 경로 S3 에 저장 후 이 url 저장
    @Column(name = "path_file_url", nullable = false, length = 255)
    private String pathFileUrl; 

    // 산책 경로 표시한 지도 모습 캡쳐 후 S3에 저장하고 이 링크 저장
    @Column(name = "snapshot_url", nullable = false, length = 255)
    private String snapshotUrl;

    @Column(name = "created_at", nullable = false, updatable = false, insertable = false,
            columnDefinition = "TIMESTAMP DEFAULT NOW()")
    private LocalDateTime createdAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mission_result_id",
            nullable = true, // MissionResult에 따라 있을수도 없을수도 있음
            unique = true)
    private MissionResult missionResult;

    @Column(name = "distance", nullable = false)
    private double distance;

    @PrePersist
    private void prePersist() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
        this.verified = false;
    }

    @Column(name = "verified", nullable = false)
    private boolean verified;

    /**
     * 산책 완료 검증 처리
     */
    public void verify() {
        this.verified = true;
    }

    /**
     * Builder 팩토리 (verified 자동 false)
     */
    public static WalkResult of(MissionResult mr, LocalDateTime startTime) {
        return WalkResult.builder()
                .missionResult(mr)
                .startTime(startTime)
                .verified(false)
                .build();
    }

}

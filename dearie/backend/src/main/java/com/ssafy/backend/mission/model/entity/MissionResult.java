package com.ssafy.backend.mission.model.entity;

import com.ssafy.backend.mission.model.enums.MissionResultType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "mission_results")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class MissionResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "result_type", nullable = false)
    private MissionResultType resultType;  // WALK, IMAGE, TEXT, MUSIC 등

    @Column(name = "value", nullable = false, length = 100)
    private String value;           // 결과 값 (예: gpx key나 텍스트)

    @Column(name = "verified", nullable = false)
    private Boolean verified;       // 검증 여부

    @Column(name = "created_at", nullable = false, updatable = false,
            columnDefinition = "TIMESTAMP DEFAULT NOW()")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_mission_id", nullable = false)
    private UserMission userMission;

    @OneToOne(mappedBy = "missionResult", fetch = FetchType.LAZY,
        optional = true)
    private WalkResult walkResult;

    /**
     * 새 MissionResult 생성 시에는 verified=false 고정
     */
    public static MissionResult of(UserMission um, MissionResultType type, String value) {
        return MissionResult.builder()
                .userMission(um)
                .resultType(type)
                .value(value)
                .verified(false)
                .build();
    }

    /**
     * 검증 완료 처리
     */
    public void verify() {
        this.verified = true;
    }

    /**
     * 검증 여부 조회
     */
    public boolean isVerified() {
        return this.verified;
    }

    public void updateValue(String value) { this.value = value; }
}

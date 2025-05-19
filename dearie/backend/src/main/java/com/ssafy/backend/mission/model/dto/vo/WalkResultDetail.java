package com.ssafy.backend.mission.model.dto.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.Duration;
import java.time.LocalDateTime;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
public class WalkResultDetail {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Duration duration;
    private String pathFileUrl;
    private String snapshotUrl;
    private LocalDateTime createdAt;

    // 관계된 PK 값만 꺼내서 노출
    private Long userMissionId;
    private Long missionResultId;

    private boolean isVerified;
}

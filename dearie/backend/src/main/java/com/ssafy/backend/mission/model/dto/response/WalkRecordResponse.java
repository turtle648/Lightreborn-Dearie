package com.ssafy.backend.mission.model.dto.response;

import lombok.*;

import java.time.Duration;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalkRecordResponse {
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
    private Long userId;
}
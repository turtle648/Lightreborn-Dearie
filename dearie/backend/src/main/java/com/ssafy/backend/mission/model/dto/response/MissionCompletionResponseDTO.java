package com.ssafy.backend.mission.model.dto.response;

import com.ssafy.backend.mission.model.enums.MissionResultType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MissionCompletionResponseDTO<T> {
    private Long userMissionId;
    private MissionResultType resultType;
    private boolean isVerified;
    private LocalDateTime completedAt;
    private T detail;
}
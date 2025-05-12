package com.ssafy.backend.mission.model.dto.response;

import com.ssafy.backend.mission.model.entity.MissionResult;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MissionCompletionResponseDTO<T> {
    private Long userMissionId;
    private MissionResult.ResultType resultType;
    private boolean isVerified;
    private LocalDateTime completedAt;
    private T detail;
}
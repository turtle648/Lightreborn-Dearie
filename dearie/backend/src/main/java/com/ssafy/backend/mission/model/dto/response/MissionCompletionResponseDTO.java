package com.ssafy.backend.mission.model.dto.response;

import com.ssafy.backend.mission.model.enums.MissionExecutionType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MissionCompletionResponseDTO<T> {
    private Long userMissionId;
    private MissionExecutionType resultType;
    private LocalDateTime completedAt;
    private String missionTitle;
    private String missionContent;
    private T detail;
}
package com.ssafy.backend.mission.model.dto.response;

import com.ssafy.backend.mission.model.enums.MissionTypeMapping;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DailyMissionResponseDTO {
    private Long Id;
    private Long missionId;

    private String missionTitle;
    private String content;
    private Boolean isCompleted;

    private MissionTypeMapping missionType;
}
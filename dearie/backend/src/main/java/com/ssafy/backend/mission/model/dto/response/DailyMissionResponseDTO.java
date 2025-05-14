package com.ssafy.backend.mission.model.dto.response;

import com.ssafy.backend.mission.model.enums.MissionTypeMapping;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DailyMissionResponseDTO {
    private Long missionId;

    private String content;

    private MissionTypeMapping missionType;
}
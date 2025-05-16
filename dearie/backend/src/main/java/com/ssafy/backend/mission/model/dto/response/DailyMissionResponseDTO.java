package com.ssafy.backend.mission.model.dto.response;

import com.ssafy.backend.mission.model.enums.MissionTypeMapping;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DailyMissionResponseDTO {
    private Long Id;
    private Long missionId;

    private String missionTitle;
    private String content;
    private Boolean isCompleted;

    private MissionTypeMapping missionType;
}
package com.ssafy.backend.mission.model.dto.response;

import com.ssafy.backend.mission.model.enums.MissionTypeMapping;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MissionResponseDTO {
    private Long missionId;

    private String content;

    private MissionTypeMapping missionType;
}

package com.ssafy.backend.mission.model.dto.response;

import com.ssafy.backend.mission.model.enums.MissionResultType;

import java.time.LocalDate;

public record RecentMissionResponseDTO(
        Long userMissionId,
        String title,
        LocalDate date,
        String content,
        String missionType,  // STATIC or DYNAMIC
        MissionResultType resultType,
        String imageUrl
) {}

// 단순 조회용 DTO -> Record 가 적합
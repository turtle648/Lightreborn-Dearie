package com.ssafy.backend.mission.model.dto.response;

import com.ssafy.backend.mission.model.enums.MissionResultType;

import java.time.LocalDate;

public record MissionDetailResponseDTO<T>(
        String missionTitle,
        String missionContent,
        LocalDate date,
        MissionResultType resultType,
        T detail
) {}

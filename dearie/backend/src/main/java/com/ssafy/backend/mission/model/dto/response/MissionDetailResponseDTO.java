package com.ssafy.backend.mission.model.dto.response;

import com.ssafy.backend.mission.model.enums.MissionExecutionType;

import java.time.LocalDate;

public record MissionDetailResponseDTO<T>(
        String missionTitle,
        String missionContent,
        LocalDate date,
        MissionExecutionType missionExecutionType,
        T detail
) {}

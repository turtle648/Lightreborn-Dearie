package com.ssafy.backend.mission.reader;

import com.ssafy.backend.mission.model.dto.response.DailyMissionResponseDTO;

import java.util.List;

public interface MissionReader {
    List<DailyMissionResponseDTO> getDailyMissionList();
}

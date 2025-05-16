package com.ssafy.backend.mission.reader;

import com.ssafy.backend.mission.model.dto.response.DailyMissionResponseDTO;
import com.ssafy.backend.mission.model.dto.response.MissionResponseDTO;

import java.util.List;

public interface MissionReader {
    List<MissionResponseDTO> getDailyMissionList();
}

package com.ssafy.backend.mission.service;

import com.ssafy.backend.mission.model.dto.request.MissionCompletionRequestDTO;
import com.ssafy.backend.mission.model.dto.response.DailyMissionResponseDTO;
import com.ssafy.backend.mission.model.dto.response.MissionCompletionResponseDTO;
import org.apache.coyote.BadRequestException;

import java.util.List;

public interface MissionService {

    MissionCompletionResponseDTO<?> verifyMissionCompletion(MissionCompletionRequestDTO request) throws BadRequestException;

    List<DailyMissionResponseDTO> getDailyMissionList(Long userId);

    void assignDailyMissionsToAllUsers();

    void deleteStableUserMissions();
}

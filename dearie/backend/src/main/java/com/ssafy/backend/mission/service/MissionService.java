package com.ssafy.backend.mission.service;

import ai.djl.translate.TranslateException;
import com.ssafy.backend.mission.model.dto.request.MissionCompletionRequestDTO;
import com.ssafy.backend.mission.model.dto.response.DailyMissionResponseDTO;
import com.ssafy.backend.mission.model.dto.response.MissionCompletionResponseDTO;

import java.io.IOException;
import java.util.List;

public interface MissionService {

    MissionCompletionResponseDTO<?> verifyMissionCompletion(MissionCompletionRequestDTO request) throws IOException, TranslateException;

    List<DailyMissionResponseDTO> getDailyMissionList(Long userId);

    void assignDailyMissionsToAllUsers();

    void deleteStableUserMissions();
}

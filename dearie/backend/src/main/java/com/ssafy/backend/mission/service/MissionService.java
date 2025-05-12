package com.ssafy.backend.mission.service;

import com.ssafy.backend.mission.model.dto.request.MissionCompletionRequestDTO;
import com.ssafy.backend.mission.model.dto.response.MissionCompletionResponseDTO;

public interface MissionService {

    MissionCompletionResponseDTO<?> verifyMissionCompletion(MissionCompletionRequestDTO request);

}

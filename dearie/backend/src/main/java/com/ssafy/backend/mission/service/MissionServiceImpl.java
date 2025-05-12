package com.ssafy.backend.mission.service;

import com.ssafy.backend.mission.model.dto.request.MissionCompletionRequestDTO;
import com.ssafy.backend.mission.model.dto.response.MissionCompletionResponseDTO;
import org.springframework.stereotype.Service;

@Service
public class MissionServiceImpl implements MissionService {

    @Override
    public MissionCompletionResponseDTO<?> verifyMissionCompletion(MissionCompletionRequestDTO request) {
        MissionCompletionResponseDTO<Object> response = new MissionCompletionResponseDTO();
        return response;
    }
}

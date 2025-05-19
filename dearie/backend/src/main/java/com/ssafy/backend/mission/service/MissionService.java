package com.ssafy.backend.mission.service;

import ai.djl.translate.TranslateException;
import com.ssafy.backend.mission.model.dto.request.MissionCompletionRequestDTO;
import com.ssafy.backend.mission.model.dto.response.DailyMissionResponseDTO;
import com.ssafy.backend.mission.model.dto.response.MissionCompletionResponseDTO;
import com.ssafy.backend.mission.model.dto.response.MissionDetailResponseDTO;
import com.ssafy.backend.mission.model.dto.response.RecentMissionResponseDTO;
import org.apache.coyote.BadRequestException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface MissionService {

    MissionCompletionResponseDTO<?> verifyMissionCompletion(Long userMissionId, Long uuid, MissionCompletionRequestDTO request,
        MultipartFile snapshotFile
    ) throws IOException, TranslateException;

    List<DailyMissionResponseDTO> getDailyMissionList(Long userId);

    void assignDailyMissionsToAllUsers();

    void deleteStableUserMissions();

    List<RecentMissionResponseDTO> getRecentCompleteMissions(Long userId, int page);

    MissionDetailResponseDTO<?> getCompletedMissionDetail(Long userMissionId, Long userId);

}

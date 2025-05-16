package com.ssafy.backend.mission.reader;

import com.ssafy.backend.mission.model.dto.response.MissionResponseDTO;
import com.ssafy.backend.mission.repository.MissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class MissionReaderImpl implements MissionReader {
    private final MissionRepository missionRepository;

    @Override
    public List<MissionResponseDTO> getDailyMissionList() {
        return missionRepository.findRandomMissions().stream()
                .map(m -> MissionResponseDTO.builder()
                        .missionType(m.getMissionType().getType())
                        .content(m.getContent())
                        .missionId(m.getId())
                        .build())
                .toList();
    }
}

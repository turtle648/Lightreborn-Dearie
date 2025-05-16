package com.ssafy.backend.mission.reader;

import com.ssafy.backend.mission.model.dto.response.DailyMissionResponseDTO;
import com.ssafy.backend.mission.repository.MissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class MissionReaderImpl implements MissionReader {
    private final MissionRepository missionRepository;

    @Override
    public List<DailyMissionResponseDTO> getDailyMissionList() {
        return missionRepository.findRandomMissions().stream()
                .map(m -> new DailyMissionResponseDTO(m.getId(), m.getContent(), m.getMissionType().getType()))
                .toList();
    }
}

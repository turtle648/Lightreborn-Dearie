package com.ssafy.backend.mission.reader;

import com.ssafy.backend.mission.repository.UserMissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserMissionReaderImpl implements UserMissionReader{

    private final UserMissionRepository userMissionRepository;

    @Override
    public Integer getUserCompletedMissionCount(Long userId) {
        return userMissionRepository.countByUserIdAndIsCompletedTrue(userId);
    }
}

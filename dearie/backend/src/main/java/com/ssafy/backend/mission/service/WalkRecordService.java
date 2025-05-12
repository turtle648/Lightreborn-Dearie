package com.ssafy.backend.mission.service;

import com.ssafy.backend.mission.model.dto.response.WalkRecordResponse;
import com.ssafy.backend.mission.model.entity.WalkRecord;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

public interface WalkRecordService {
    // 산책 기록 시작
    WalkRecordResponse startWalk(Long userMissionId, LocalDateTime startTime);

    // 산책 기록 종료
    WalkRecordResponse endWalk(Long userMissionId, LocalDateTime endTime,
                               String pathJson, MultipartFile multipartFile);

}
package com.ssafy.backend.mission.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.backend.auth.model.entity.User;
import com.ssafy.backend.common.config.S3Uploader;
import com.ssafy.backend.mission.model.dto.response.WalkRecordResponse;
import com.ssafy.backend.mission.model.entity.MissionResult;
import com.ssafy.backend.mission.model.entity.UserMission;
import com.ssafy.backend.mission.model.entity.WalkRecord;
import com.ssafy.backend.mission.model.enums.MissionResultType;
import com.ssafy.backend.mission.repository.MissionResultRepository;
import com.ssafy.backend.mission.repository.WalkRecordRepository;
import com.ssafy.backend.mission.repository.UserMissionRepository;
import com.ssafy.backend.mission.service.WalkRecordService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class WalkRecordServiceImpl implements WalkRecordService {
    private final UserMissionRepository userMissionRepository;
    private final WalkRecordRepository walkRecordRepository;
    private final MissionResultRepository missionResultRepository;
    private final S3Uploader s3Uploader;            // S3 업로더 래퍼
    private final ObjectMapper objectMapper;        // JSON 변환용

    // 산책 미션 시작을 위한 서비스
    @Override
    @Transactional
    public WalkRecordResponse startWalk(Long userMissionId, LocalDateTime startTime) {
        // 1) UserMission 조회
        UserMission um = userMissionRepository.findById(userMissionId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid userMissionId: " + userMissionId));

        // 2) MissionResult 신규 생성 (WALK 타입, 아직 value/verify는 빈값 또는 false)
        MissionResult mr = MissionResult.builder()
                .userMission(um)
                .resultType(MissionResultType.WALK)
                .value("")
                .verified(false)
                .build();
        MissionResult savedMr = missionResultRepository.save(mr);

        // 3) WalkRecord 생성 (missionResult 연결)
        WalkRecord wr = WalkRecord.builder()
                .missionResult(savedMr)
                .startTime(startTime)
                .build();
        WalkRecord savedWr = walkRecordRepository.save(wr);

        // 4) DTO 변환
        return mapToDto(savedWr);
    }

    // 선택한 산책 미션의 완료를 위한 서비스
    @Override
    @Transactional
    public WalkRecordResponse endWalk(Long missionResultId, LocalDateTime endTime,
        String pathJson, MultipartFile snapshotFile)
    {
        // 1) MissionResult 조회
        MissionResult mr = missionResultRepository.findById(missionResultId)
                .orElseThrow(() -> new IllegalArgumentException("No missionResult: " + missionResultId));

        // 2) WalkRecord 유무 확인
        WalkRecord wr = mr.getWalkRecord();
        if (wr == null) {
            throw new IllegalStateException("WalkRecord not started for missionResult: " + missionResultId);
        }

        // 3) S3 업로드 (경로 JSON, 스냅샷)
        String pathKey = String.format("walk/%d/path-%d.json", missionResultId, System.currentTimeMillis());
        String pathUrl = s3Uploader.uploadBytes(pathKey, pathJson.getBytes(StandardCharsets.UTF_8), "application/json");

        String imgKey = String.format("walk/%d/snapshot-%d.png", missionResultId, System.currentTimeMillis());
        String snapshotUrl = s3Uploader.upload(imgKey, snapshotFile);

        // 4) 엔티티 업데이트 & 저장W
        WalkRecord updated = wr.toBuilder()
                .endTime(endTime)
                .duration(Duration.between(wr.getStartTime(), endTime))
                .pathFileUrl(pathUrl)
                .snapshotUrl(snapshotUrl)
                .verified(true)
                .build();
        WalkRecord saved = walkRecordRepository.save(updated);

        // 5) 저장
        return mapToDto(saved);
    }

    // Entity → DTO 변환기
    private WalkRecordResponse mapToDto(WalkRecord r) {
        MissionResult mr = r.getMissionResult();
        UserMission um = mr.getUserMission();
        User u = um.getUser();

        return WalkRecordResponse.builder()
                .id(r.getId())
                .startTime(r.getStartTime())
                .endTime(r.getEndTime())
                .duration(r.getDuration())
                .pathFileUrl(r.getPathFileUrl())
                .snapshotUrl(r.getSnapshotUrl())
                .createdAt(r.getCreatedAt())
                .missionResultId(mr.getId())
                .userMissionId(um.getId())
                .userId(u.getId())
                .build();
    }
}

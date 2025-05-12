package com.ssafy.backend.mission.controller;

import com.ssafy.backend.common.dto.BaseResponse;
import com.ssafy.backend.mission.model.dto.response.WalkRecordResponse;
import com.ssafy.backend.mission.model.entity.WalkRecord;
import com.ssafy.backend.mission.service.WalkRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/walk-records")
@Tag(name="WalkRecord", description = "산책 미션 기록")
public class WalkRecordController {
    private final WalkRecordService walkRecordService;

    @Operation(summary = "산책 기록 시작", description = "산책 기록 시작을 위한 API")
    @PostMapping("/{userMissionId}/start")
    public ResponseEntity<BaseResponse<WalkRecordResponse>> startWalk(
            @PathVariable Long userMissionId,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime startTime
    ) {
        WalkRecordResponse dto = walkRecordService.startWalk(
                userMissionId,
                startTime != null ? startTime : LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BaseResponse.success(201, "산책 기록을 시작했습니다.", dto));
    }

    @Operation(summary = "산책 기록 종료를 위한 API", description = "산책 기록 종료를 위한 API입니다.")
    @PostMapping("/{userMissionId}/end")
    public ResponseEntity<BaseResponse<WalkRecordResponse>> endWalk(
            @PathVariable Long missionResultId,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            LocalDateTime endTime,
            @RequestPart("pathData") String pathJson,           // 프론트에서 JSON 문자열로 보내는 GPS 경로
            @RequestPart("snapshot") MultipartFile snapshotFile // 캡쳐된 산책 경로 지도 이미지
    ) {
        WalkRecordResponse dto = walkRecordService.endWalk(
                missionResultId,
                endTime != null ? endTime : LocalDateTime.now(),
                pathJson,
                snapshotFile
        );
        return ResponseEntity.ok(BaseResponse.success("산책 기록을 종료했습니다.", dto));
    }
}

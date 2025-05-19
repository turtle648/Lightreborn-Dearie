package com.ssafy.backend.mission.controller;

import ai.djl.translate.TranslateException;
import com.ssafy.backend.auth.exception.AuthErrorCode;
import com.ssafy.backend.auth.exception.AuthException;
import com.ssafy.backend.auth.repository.UserRepository;
import com.ssafy.backend.common.dto.BaseResponse;
import com.ssafy.backend.mission.model.dto.request.MissionCompletionRequestDTO;
import com.ssafy.backend.mission.model.dto.response.DailyMissionResponseDTO;
import com.ssafy.backend.mission.model.dto.response.MissionCompletionResponseDTO;
import com.ssafy.backend.mission.model.dto.response.MissionDetailResponseDTO;
import com.ssafy.backend.mission.model.dto.response.RecentMissionResponseDTO;
import com.ssafy.backend.mission.model.enums.MissionExecutionType;
import com.ssafy.backend.mission.service.MissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/missions")
@Tag(name="Missions", description = "미션 제공, 검증 등을 위한 API")
public class MissionController {

    private final MissionService missionService;
    private final UserRepository userRepository;

    @PostMapping(value = "/{userMissionId}/completions", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
            summary = "미션 수행 검증 API",
            description = """
                    📋 **사용자가 받은 미션이 완수 조건을 만족하는지 확인합니다.**
                    완료했으면, MissionResultType에 따라 결과 기록하고 성공했다고 표시합니다.
            """
    )
    public ResponseEntity<BaseResponse<MissionCompletionResponseDTO<?>>> verifyMissionCompletion(
            @PathVariable Long userMissionId,
            @ModelAttribute @Validated MissionCompletionRequestDTO req,
            @RequestPart(value = "snapshotFile", required = false) MultipartFile snapshotFile,
            @AuthenticationPrincipal String userId
    ) throws IOException, TranslateException {

        Long uuid = userRepository.findByLoginId(userId)
                .orElseThrow(() -> new AuthException(AuthErrorCode.USER_NOT_FOUND))
                .getId();

        MissionCompletionResponseDTO<?> response = missionService.verifyMissionCompletion(userMissionId, uuid, req, snapshotFile);
        return ResponseEntity.ok().body(BaseResponse.success("미션 검증 완료", response));
    }


    @GetMapping(value = "/today")
    @Operation(
            summary = "오늘의 미션 검색 API",
            description = """
                    📋 **오늘 사용자가 수행해야하는 5개의 미션을 조회합니다.**
            """
    )
    public ResponseEntity<BaseResponse<List<DailyMissionResponseDTO>>> getDailyMissionList(
            @AuthenticationPrincipal String userId) {
        Long uuid = userRepository.findByLoginId(userId)
                .orElseThrow(() -> new AuthException(AuthErrorCode.USER_NOT_FOUND))
                .getId();

        List<DailyMissionResponseDTO> dailyMissions = missionService.getDailyMissionList(uuid);

        return ResponseEntity.ok().body(BaseResponse.success("오늘의 미션을 검색했습니다.", dailyMissions));
    }

    @GetMapping("/recent-success")
    @Operation(summary = "최근 성공한 미션 조회 (최신순 5개)", description = "로그인한 사용자의 최근 완료된 미션 5개를 최신순으로 제공합니다.")
    public ResponseEntity<BaseResponse<List<RecentMissionResponseDTO>>> getRecentSuccessfulMissions(
            @AuthenticationPrincipal String userId,
            @RequestParam(defaultValue = "0") int page
    ) {
        Long uuid = userRepository.findByLoginId(userId)
                .orElseThrow(() -> new AuthException(AuthErrorCode.USER_NOT_FOUND))
                .getId();

        List<RecentMissionResponseDTO> result = missionService.getRecentCompleteMissions(uuid, page);
        return ResponseEntity.ok().body(BaseResponse.success("최근 완료 미션 조회 성공", result));
    }

    @GetMapping("/recent-success/{userMissionId}/{missionExecutionType}")
    @Operation(summary = "완료된 미션 상세 조회", description = "유저가 완료한 하나의 미션의 상세 정보를 반환합니다.")
    public ResponseEntity<BaseResponse<MissionDetailResponseDTO<?>>> getCompletedMissionDetail(
            @PathVariable Long userMissionId,
            @PathVariable MissionExecutionType missionExecutionType,
            @AuthenticationPrincipal String userId
    ) {
        Long uuid = userRepository.findByLoginId(userId)
                .orElseThrow(() -> new AuthException(AuthErrorCode.USER_NOT_FOUND))
                .getId();

        MissionDetailResponseDTO<?> detail = missionService.getCompletedMissionDetail(userMissionId, uuid, missionExecutionType);
        return ResponseEntity.ok(BaseResponse.success("미션 상세 조회 성공", detail));
    }
}
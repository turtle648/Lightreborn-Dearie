package com.ssafy.backend.mission.controller;

import ai.djl.translate.TranslateException;
import com.ssafy.backend.auth.exception.AuthErrorCode;
import com.ssafy.backend.auth.exception.AuthException;
import com.ssafy.backend.auth.repository.UserRepository;
import com.ssafy.backend.auth.service.AuthService;
import com.ssafy.backend.common.dto.BaseResponse;
import com.ssafy.backend.mission.model.dto.request.MissionCompletionRequestDTO;
import com.ssafy.backend.mission.model.dto.response.DailyMissionResponseDTO;
import com.ssafy.backend.mission.model.dto.response.MissionCompletionResponseDTO;
import com.ssafy.backend.mission.service.MissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/missions")
@Tag(name="Missions", description = "미션 제공, 검증 등을 위한 API")
public class MissionController {

    private final MissionService missionService;
    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping(value = "/{missionId}/completions", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
            summary = "미션 수행 검증 API",
            description = """
                    📋 **사용자가 받은 미션이 완수 조건을 만족하는지 확인합니다.**
            """
    )
    public ResponseEntity<BaseResponse<MissionCompletionResponseDTO<?>>> verifyMissionCompletion(
            @PathVariable Long missionId,
            @ModelAttribute @Validated MissionCompletionRequestDTO req
    ) throws IOException, TranslateException {

        MissionCompletionResponseDTO<?> resp = missionService.verifyMissionCompletion(req);

        return ResponseEntity.ok().body(BaseResponse.success("미션 검증에 성공했습니다.", resp));
    }

    @GetMapping(value = "/today")
    @Operation(
            summary = "오늘의 미션 검색 API",
            description = """
                    📋 **오늘 사용자가 수행해야하는 5개의 미션을 제공합니다.**
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
}
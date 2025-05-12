package com.ssafy.backend.diary.controller;

import com.ssafy.backend.common.dto.BaseResponse;
import com.ssafy.backend.diary.model.request.CreateDiaryRequestDTO;
import com.ssafy.backend.diary.model.response.GetDiaryDetailDto;
import com.ssafy.backend.diary.service.DiaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("diary")
@Tag(name="Diary", description = "일기관련 API ")
public class DiaryController {

    private final DiaryService diaryService;

    @Operation(summary = "일기 작성", description = "사용자는 일기 내용을 작성할 수 있습니다.")
    @PostMapping
    public ResponseEntity<BaseResponse<Long>> createDiary(@RequestBody CreateDiaryRequestDTO requestDTO, List<MultipartFile> images) {
        Long diaryId = diaryService.createDiary(requestDTO, images);
        return ResponseEntity.ok(new BaseResponse<>(201, "일기 작성 성공", diaryId));
    }

    @Operation(summary = "일기 상세 보기", description = "사용자는 일기의 상세 내용을 조회할 수 있다.")
    @GetMapping("/{diaryId}")
    public ResponseEntity<BaseResponse<GetDiaryDetailDto>> getDiaryDetail(
            @AuthenticationPrincipal String userId,
            @PathVariable Long diaryId
       ) {

        GetDiaryDetailDto result = diaryService.getDiary(diaryId, userId);

        return ResponseEntity.ok(BaseResponse.success(200, "일기 상세 정보 조회 성공", result));
    }




}
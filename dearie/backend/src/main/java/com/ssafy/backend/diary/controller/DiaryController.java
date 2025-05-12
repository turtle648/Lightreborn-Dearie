package com.ssafy.backend.diary.controller;

import com.ssafy.backend.common.config.S3Uploader;
import com.ssafy.backend.common.dto.BaseResponse;
import com.ssafy.backend.diary.model.entity.Diary;
import com.ssafy.backend.diary.model.request.CreateDiaryRequestDTO;
import com.ssafy.backend.diary.model.response.GetDiaryDetailDto;
import com.ssafy.backend.diary.service.DiaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("diary")
@Tag(name="Diary", description = "일기관련 API ")
public class DiaryController {

    private final DiaryService diaryService;

    @Operation(summary = "일기 상세 보기", description = "사용자는 일기의 상세 내용을 조회할 수 있다.")
    @GetMapping("/{diaryId}")
    public ResponseEntity<BaseResponse<GetDiaryDetailDto>> getDiaryDetail(
            @AuthenticationPrincipal String userId,
            @PathVariable Long diaryId
       ) {

        GetDiaryDetailDto result = diaryService.getDiary(diaryId, userId);

        return ResponseEntity.ok(BaseResponse.success(200, "일기 상세 정보 조회 성공", result));
    }

    @PostMapping(consumes = {
            MediaType.MULTIPART_FORM_DATA_VALUE,
            MediaType.APPLICATION_FORM_URLENCODED_VALUE + ";charset=UTF-8"
    })    @Operation(summary = "이미지와 함께 일기 작성", description = "이미지를 S3에 업로드하고 일기를 함께 저장합니다")
    public ResponseEntity<BaseResponse<Long>> createDiary(
            @RequestParam("content") String content,
            @RequestParam("emotionTag") Diary.EmotionTag emotionTag,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @AuthenticationPrincipal String userId
    ) {
        try {
            Long diaryId = diaryService.createDiaryWithImages(content, emotionTag, images, userId);
            return ResponseEntity.ok(BaseResponse.success(201, "일기 작성 및 이미지 업로드 성공", diaryId));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(BaseResponse.fail(500, "일기 작성 실패: " + e.getMessage()));
        }
    }

}
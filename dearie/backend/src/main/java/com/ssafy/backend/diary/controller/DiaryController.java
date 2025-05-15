package com.ssafy.backend.diary.controller;

import com.ssafy.backend.common.dto.BaseResponse;
import com.ssafy.backend.diary.model.entity.Diary;
import com.ssafy.backend.diary.model.request.CreateDiaryRequestDTO;
import com.ssafy.backend.diary.model.request.DiarySearchRequest;
import com.ssafy.backend.diary.model.response.DiaryListResponse;
import com.ssafy.backend.diary.model.response.GetDiaryDetailDto;
import com.ssafy.backend.diary.service.DiaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("diaries")
@Tag(name="Diary", description = "일기관련 API ")
public class DiaryController {

    private final DiaryService diaryService;

    @Operation(summary = "내가 작성한 일기 조회", description = "사용자는 작성한 일기 목록을 검색, 정렬하여 조회할 수 있다.")
    @GetMapping
    public ResponseEntity<BaseResponse<DiaryListResponse>> getMyDiaries(
            @AuthenticationPrincipal String loginId,
            @ModelAttribute DiarySearchRequest request
    ) {
        DiaryListResponse result = diaryService.getMyDiaries(loginId, request);
        return ResponseEntity.ok(BaseResponse.success(200, "일기 전체 조회를 성공했습니다.", result));
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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "일기 작성", description = "이미지와 JSON을 함께 업로드")
    public ResponseEntity<?> createDiary(
            @RequestPart("diary") @Parameter(description = "일기 본문 및 감정") CreateDiaryRequestDTO request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @AuthenticationPrincipal String userId
    ) {
        try {
            Long diaryId = diaryService.createDiaryWithImages(request.getContent(), request.getEmotionTag(), images, userId);
            return ResponseEntity.ok(BaseResponse.success(201, "일기 작성 및 이미지 업로드 성공", diaryId));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(BaseResponse.fail(500, "일기 작성 실패: " + e.getMessage()));
        }
    }

    @Operation(summary = "일기에 대한 AI의 코멘트", description = "AI를 이용하여 일기 내용에 대한 코멘트를 받을 수 있다.")
    @GetMapping("/{diaryId}/ai-comments")
    public ResponseEntity<BaseResponse<String>> createAiComment(
            @AuthenticationPrincipal String userId,
            @PathVariable Long diaryId
    ) {

        String result = diaryService.createAiComment(diaryId, userId);

        return ResponseEntity.ok(BaseResponse.success(200, "AI 코멘트 생성 성공", result));
    }

    @Operation(summary = "일기 삭제", description = "작성한 일기를 삭제합니다.")
    @DeleteMapping("/{diaryId}")
    public ResponseEntity<BaseResponse<Integer>> deleteDiary(
            @AuthenticationPrincipal String userId,
            @PathVariable Long diaryId
    ) {
        int result = diaryService.deleteDiary(diaryId, userId);

        String message = (result == 1) ? "일기 삭제 성공" : "삭제할 일기가 없습니다.";
        return ResponseEntity.ok(BaseResponse.success(200, message, result));
    }

    @Operation(summary = "북마크 추가", description = "작성한 일기에 대해서 북마크를 추가합니다.")
    @PostMapping("{diaryId}/bookmark")
    public ResponseEntity<BaseResponse<Integer>> addBookmark(
            @AuthenticationPrincipal String userId,
            @PathVariable Long diaryId
    ) {
        boolean result = diaryService.addBookmark(userId, diaryId);

        String message = result ? "북마크 추가 성공" : "이미 북마크된 일기입니다.";
        return ResponseEntity.ok(BaseResponse.success(200, message, result ? 1 : 0));
    }

    @Operation(summary = "북마크 삭제", description = "작성한 일기에 대한 북마크를 삭제합니다.")
    @DeleteMapping("{diaryId}/bookmark")
    public ResponseEntity<BaseResponse<Integer>> deleteBookmark(
            @AuthenticationPrincipal String userId,
            @PathVariable Long diaryId
    ) {
        boolean result = diaryService.deleteBookmark(userId, diaryId);

        String message = result ? "북마크 삭제 성공" : "해당 일기에 대한 북마크가 없습니다.";
        return ResponseEntity.ok(BaseResponse.success(200, message, result ? 1 : 0));
    }
}
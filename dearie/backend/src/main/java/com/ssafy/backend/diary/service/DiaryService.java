package com.ssafy.backend.diary.service;

import com.ssafy.backend.diary.model.dto.response.EmotionTagDTO;
import com.ssafy.backend.diary.model.dto.response.GetDiaryReportDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import com.ssafy.backend.diary.model.entity.Diary;
import com.ssafy.backend.diary.model.request.DiarySearchRequest;
import com.ssafy.backend.diary.model.response.DiaryListResponse;
import com.ssafy.backend.diary.model.response.EmotionWindowResponseDTO;
import com.ssafy.backend.diary.model.response.GetDiaryDetailDto;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;


public interface DiaryService {
    List<GetDiaryReportDTO> getDiariesOfWeek(Long userId, LocalDate date);

    List<EmotionTagDTO> getDiaryEmotions(Long diaryId);

    Map<String, Integer> getWeeklyEmotionSummary(Long userId, LocalDate date);
    GetDiaryDetailDto getDiary(Long DiaryId, String userId);

    Long createDiaryWithImages(String content, Diary.EmotionTag emotionTag, List<MultipartFile> images, String userId);

    CompletableFuture<String> createAiComment(Long DiaryId, String userId);

    Integer deleteDiary(Long DiaryId, String userId);

    Boolean addBookmark(String userId, Long diaryId);

    Boolean deleteBookmark(String userId, Long diaryId);

    DiaryListResponse getMyDiaries(String loginId, DiarySearchRequest request);

    EmotionWindowResponseDTO getEmotionWindow(String userId);
}

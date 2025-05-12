package com.ssafy.backend.diary.service;

import com.ssafy.backend.diary.model.entity.Diary;
import com.ssafy.backend.diary.model.request.CreateDiaryRequestDTO;
import com.ssafy.backend.diary.model.response.GetDiaryDetailDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DiaryService {

    GetDiaryDetailDto getDiary(Long DiaryId, String userId);

    Long createDiaryWithImages(String content, Diary.EmotionTag emotionTag, List<MultipartFile> images, String userId);


}

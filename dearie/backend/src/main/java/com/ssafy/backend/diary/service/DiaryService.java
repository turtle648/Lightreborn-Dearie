package com.ssafy.backend.diary.service;

import com.ssafy.backend.diary.model.request.CreateDiaryRequestDTO;
import com.ssafy.backend.diary.model.response.GetDiaryDetailDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DiaryService {
    Long createDiary(CreateDiaryRequestDTO requestDTO, List<MultipartFile> images);

    GetDiaryDetailDto getDiary(Long DiaryId, String userId);



}

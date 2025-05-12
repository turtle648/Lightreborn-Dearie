package com.ssafy.backend.diary.service;

import com.ssafy.backend.diary.model.request.CreateDiaryRequestDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DiaryService {
    Long createDiary(CreateDiaryRequestDTO requestDTO, List<MultipartFile> images);


}

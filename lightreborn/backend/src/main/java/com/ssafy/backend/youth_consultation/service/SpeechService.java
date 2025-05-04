package com.ssafy.backend.youth_consultation.service;

import com.ssafy.backend.youth_consultation.model.dto.request.SpeechRequestDTO;
import com.ssafy.backend.youth_consultation.model.dto.response.SpeechResponseDTO;
import com.ssafy.backend.youth_consultation.model.dto.response.SurveyUploadDTO;
import org.springframework.web.multipart.MultipartFile;

public interface SpeechService {
    SpeechResponseDTO getGeneralSummarize(SpeechRequestDTO responseDTO);
    SurveyUploadDTO uploadIsolationYouthInfo(MultipartFile file);
}

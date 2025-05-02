package com.ssafy.backend.youth_consultation.service;

import com.ssafy.backend.youth_consultation.model.dto.request.SpeechRequestDTO;
import com.ssafy.backend.youth_consultation.model.dto.response.SpeechResponseDTO;

public interface SpeechService {
    SpeechResponseDTO getGeneralSummarize(SpeechRequestDTO responseDTO);
}

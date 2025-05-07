package com.ssafy.backend.youth_consultation.service;

import com.ssafy.backend.youth_consultation.model.dto.request.PeopleInfoRequestDTO;
import com.ssafy.backend.youth_consultation.model.dto.request.SpeechRequestDTO;
import com.ssafy.backend.youth_consultation.model.dto.response.PeopleInfoResponseDTO;
import com.ssafy.backend.youth_consultation.model.dto.response.SpeechResponseDTO;
import com.ssafy.backend.youth_consultation.model.dto.response.SurveyUploadDTO;
import org.springframework.web.multipart.MultipartFile;

public interface YouthConsultationService {
    PeopleInfoResponseDTO getPeopleInfo(int pageNum, int sizeNum);
    PeopleInfoResponseDTO searchPeopleInfo(PeopleInfoRequestDTO peopleInfoRequestDTO);
    SpeechResponseDTO getGeneralSummarize(SpeechRequestDTO responseDTO);
    SurveyUploadDTO uploadIsolationYouthInfo(MultipartFile file);
}

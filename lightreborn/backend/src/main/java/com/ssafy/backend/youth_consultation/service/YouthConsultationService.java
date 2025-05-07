package com.ssafy.backend.youth_consultation.service;

import com.ssafy.backend.youth_consultation.model.dto.request.AddScheduleRequestDTO;
import com.ssafy.backend.youth_consultation.model.dto.request.PeopleInfoRequestDTO;
import com.ssafy.backend.youth_consultation.model.dto.request.SpeechRequestDTO;
import com.ssafy.backend.youth_consultation.model.dto.request.UpdateCounselingLogRequestDTO;
import com.ssafy.backend.youth_consultation.model.dto.response.*;
import org.springframework.web.multipart.MultipartFile;

public interface YouthConsultationService {
    GetCounselingLogResponseDTO getCounselingLog(int pageNum, int sizeNum);
    PeopleInfoResponseDTO searchPeopleInfo(PeopleInfoRequestDTO peopleInfoRequestDTO);
    AddScheduleResponseDTO addSchedule(Long id, AddScheduleRequestDTO addScheduleRequestDTO);
    SpeechResponseDTO getGeneralSummarize(SpeechRequestDTO responseDTO);
    SurveyUploadDTO uploadIsolationYouthInfo(MultipartFile file);
    SpeechResponseDTO updateCounselingLog(Long id, UpdateCounselingLogRequestDTO requestDTO);
}

package com.ssafy.backend.youth_population.service;

import com.ssafy.backend.youth_population.model.dto.response.YouthPopulationResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface YouthPopulationService {

    /**
     * @param file 업로드할 데이터 파일
     * @return 업로드한 파일에 대한 청년 인구 데이터 정보
     * */
    List<YouthPopulationResponseDTO> uploadAndProcess(MultipartFile file) throws IOException;

    /**
     * 업로드한 파일에 대한 파싱을 진행하는 함수
     * */
    List<YouthPopulationResponseDTO> parseAndMapFile(MultipartFile file) throws IOException;
}

package com.ssafy.backend.welfare_center.service;

import com.ssafy.backend.welfare_center.model.response.WelfareCenterResponseDTO;
import com.ssafy.backend.youth_population.model.dto.response.YouthPopulationResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface WelfareCenterService {

    /**
     * @param file 업로드할 데이터 파일
     * @return 업로드한 파일에 대한 협력 기관 데이터 정보
     * */
    List<WelfareCenterResponseDTO> uploadAndProcess(MultipartFile file) throws IOException;

    /**
     * 업로드한 파일에 대한 파싱을 진행하는 함수
     * */
    List<WelfareCenterResponseDTO> parseAndMapFile(MultipartFile file) throws IOException;
}

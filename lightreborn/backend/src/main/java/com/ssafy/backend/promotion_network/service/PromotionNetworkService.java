package com.ssafy.backend.promotion_network.service;

import com.ssafy.backend.promotion_network.model.response.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface PromotionNetworkService {
    /**
     * @param file 업로드할 데이터 파일
     * @return 업로드한 파일에 대한 홍보 네트워크망 데이터 정보
     * */
    List<PromotionNetworkResponseDTO> uploadAndProcess(MultipartFile file) throws IOException;

    /**
     * 업로드한 파일에 대한 파싱을 진행하는 함수
     * */
    List<PromotionNetworkResponseDTO> parseAndMapFile(MultipartFile file) throws IOException;

    List<PromotionResponseDTO> selectPromotions(Long dongCode);

    PromotionSummaryResponse getPromotionSummary(Long dongCode);

    Map<String, Double> calculatePromotionTypeRatio(Long donCode);

    Map<String, Double> calculatePromotionPlaceTypeRatio(Long donCode);

    List<PromotionPerYouthDto> calculatePromotionPerYouth();

    List<PromotionExportDTO> selectPromotionExportData(Long donCode);

    List<PromotionLatestDataDTO> getPromotionLatestData();
}



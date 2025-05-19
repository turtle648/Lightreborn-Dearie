package com.ssafy.backend.youth_population.service;

import com.ssafy.backend.youth_population.model.dto.response.*;
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

    /**
     * 선택한 행정동 코드로 1인 가구 비율과 1인 가구 성비 조회
     * */
    YouthHouseholdRatioDTO getYouthHouseholdRatioByDongCode(Long dongCode) throws IOException;

    /*
    * 선택한 행정동 코드로 청년 인구 비율 조회
    * */
    YouthStatsByRegionDTO getYouthDistributionByDongCode(Long dongCode) throws IOException;

    /*
    * 행정동 별 전체 청년 인구 분포 비율 조회
    * */
    List<YouthRegionDistributionDTO> getYouthDistributionAllRegions() throws IOException;

    /*
    * 통합 데이터 조회
    * */
    YouthDashboardSummaryDTO getInitialDashboardData() throws IOException;

    /*
     * 청년 인구 통계 자료에 대한 최신 데이터 조회
     * */
    List<YouthPopulationLatestDataDTO> getYouthPopulationLatestData() throws IOException;

}

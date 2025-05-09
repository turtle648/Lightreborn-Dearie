package com.ssafy.backend.welfare_center.service;

import com.ssafy.backend.welfare_center.model.response.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface WelfareCenterService {

    /**
     * @param file 업로드할 데이터 파일
     * @return 업로드한 파일에 대한 협력 기관 데이터 정보
     * */
    List<WelfareCenterDTO> uploadAndProcess(MultipartFile file) throws IOException;

    /**
     * 업로드한 파일에 대한 파싱을 진행하는 함수
     * */
    List<WelfareCenterDTO> parseAndMapFile(MultipartFile file) throws IOException;

    // 전체 기관 위치 조회
    List<WelfareCenterLocationDTO> getAllWelfareCenterLocations();

    // 행정동별 기관 위치 조회
    List<WelfareCenterLocationDTO> getWelfareCenterLocationsByDong(String dongCode);

    // 청년 인구 대비 기관 비율 조회
    List<WelfareCenterYouthStatsDTO> getYouthRatioByDong(String dongCode);

    // 평균 대비 기관 현황 조회
    List<WelfareCenterYouthStatsDTO> getAverageComparisonByDong(String dongCode);

    // 행정동별 기관 상세 리스트
    List<WelfareCenterDetailDTO> getWelfareCenterDetailsByDong(String dongCode);

    // 전체 기관 상세 리스트
    List<WelfareCenterDetailDTO> getAllWelfareCenterDetails();

    // 전체 기관 상세 리스트 다운로드
    List<WelfareCenterExportDTO> getAllWelfareCenterExportData();

    // 대시보드 통합 데이터
    WelfareCenterSummaryDTO getDashboardSummary();
}
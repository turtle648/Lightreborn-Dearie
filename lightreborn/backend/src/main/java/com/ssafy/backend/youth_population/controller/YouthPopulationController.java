package com.ssafy.backend.youth_population.controller;

import com.ssafy.backend.common.dto.BaseResponse;
import com.ssafy.backend.youth_population.model.dto.response.*;
import com.ssafy.backend.youth_population.service.YouthPopulationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("youth-populations")
@Tag(name = "YouthPopulation", description = "청년 인구 관련 API(데이터 추가, 조회)")
public class YouthPopulationController {

    private final YouthPopulationService youthPopulationService;

    @Operation(summary = "청년 인구 API", description = "청년 인구 대시보드 데이터에 대한 기능들입니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "청년 인구 데이터 업데이트 성공"),
            @ApiResponse(responseCode = "400", description = "요청 값 오류"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @PostMapping(value = "/data", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BaseResponse<List<YouthPopulationResponseDTO>>> uploadData(@RequestParam("file") MultipartFile file) throws IOException {
        List<YouthPopulationResponseDTO> result = youthPopulationService.uploadAndProcess(file);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BaseResponse.success(201, "데이터 업로드를 성공했습니다.", result));
    }

    @Operation(summary = "청년 1인 가구 비율 및 성비 조회")
    @GetMapping("/single-household-ratio/{dong-code}")
    public ResponseEntity<BaseResponse<YouthHouseholdRatioDTO>> getYouthHouseholdRatio(@PathVariable("dong-code") Long dongCode) throws IOException {
        YouthHouseholdRatioDTO result = youthPopulationService.getYouthHouseholdRatioByDongCode(dongCode);
        return ResponseEntity.ok(BaseResponse.success(200, "청년 1인 가구 비율 조회를 성공했습니다.", result));
    }

    @Operation(summary = "청년 인구 데이터 통합 조회")
    @GetMapping
    public ResponseEntity<BaseResponse<YouthDashboardSummaryDTO>> getDashboardSummary() throws IOException {
        YouthDashboardSummaryDTO result = youthPopulationService.getInitialDashboardData();
        return ResponseEntity.ok(BaseResponse.success(200, "청년 통합 통계 조회에 성공했습니다.", result));
    }

    @Operation(summary = "행정구역별 청년 인구 비율을 조회")
    @GetMapping("/distribution")
    public ResponseEntity<BaseResponse<Map<String, Object>>> getYouthDistributionAllRegions() throws IOException{
        List<YouthRegionDistributionDTO> result = youthPopulationService.getYouthDistributionAllRegions();
        return ResponseEntity.ok(BaseResponse.success(200, "지역별 청년 비율 조회를 성공했습니다.", Map.of("regionData", result)));
    }

    @Operation(summary = "행정동의 청년 인구 비율 조회", description = "행정동의 청년 인구 수 / 양산 시 전체 청년 인구 수")
    @GetMapping("/distribution/{dong-code}")
    public ResponseEntity<BaseResponse<YouthStatsByRegionDTO>> getYouthDistributionByRegion(@PathVariable("dong-code") Long dongCode) throws IOException {
        YouthStatsByRegionDTO result = youthPopulationService.getYouthDistributionByDongCode(dongCode);
        return ResponseEntity.ok(BaseResponse.success(200, "청년 통계 조회를 성공했습니다.", result));
    }

    @Operation(summary = "전체 행정동 청년 인구 통계 확인", description = "청년 인구 통계에 대한 최신 데이터 확인")
    @GetMapping("/youthPopulationData/{dong-code}")
    public ResponseEntity<BaseResponse<List<YouthPopulationRecentDataDTO>>> getYouthPopulationData() throws IOException {
        List<YouthPopulationRecentDataDTO> result = youthPopulationService.getYouthPopulationRecentData();
        return ResponseEntity.ok(BaseResponse.success(200, "청년 통계 조회를 성공했습니다.", result));
    }
}
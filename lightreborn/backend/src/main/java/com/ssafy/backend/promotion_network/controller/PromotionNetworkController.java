package com.ssafy.backend.promotion_network.controller;

import com.ssafy.backend.common.dto.BaseResponse;
import com.ssafy.backend.promotion_network.model.response.PromotionDetailByRegionDTO;
import com.ssafy.backend.promotion_network.model.response.PromotionNetworkResponseDTO;
import com.ssafy.backend.promotion_network.model.response.PromotionResponseDTO;
import com.ssafy.backend.promotion_network.model.response.PromotionSummaryResponse;
import com.ssafy.backend.promotion_network.service.PromotionNetworkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("promotion-networks")
@Tag(name="PromotionNetwork", description = "홍보 네트워크망 대시보드 데이터에 대한 기능들입니다.")
public class PromotionNetworkController {

    private final PromotionNetworkService promotionNetworkService;

    @Operation(summary = "홍보 네트워크망 API", description = "홍보 네트워크망 대시보드 데이터를 입력합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "홍보 네트워크망 데이터 업데이트 성공"),
            @ApiResponse(responseCode = "400", description = "요청 값 오류"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @PostMapping(value = "/data", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BaseResponse<List<PromotionNetworkResponseDTO>>> uploadData(@RequestParam("file") MultipartFile file) throws IOException {
        List<PromotionNetworkResponseDTO> result = promotionNetworkService.uploadAndProcess(file);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BaseResponse.success(201, "데이터 업로드를 성공했습니다.", result));
    }


    @Operation(summary = "홍보물 네트워크 페이지 데이터 통합 조회", description = "홍보물 네트워크에 대한 정보를 조회합니다")
    @GetMapping("/{dong-code}/summary")
    public ResponseEntity<BaseResponse<PromotionSummaryResponse>> getPromotionSummeryData(@PathVariable("dong-code") Long dongCode){

        PromotionSummaryResponse result = promotionNetworkService.getPromotionSummary(dongCode);

        return ResponseEntity.status(HttpStatus.OK).body(BaseResponse.success(201, "데이터를 성공적으로 불러왔습니다.", result));
    }


    @Operation(summary = "특정 행정동의 홍보물 리스트 조회", description = "홍보물에 대한 정보 리스트를 조회합니다")
    @GetMapping(value = "/{dong-code}/details")
    public ResponseEntity<BaseResponse<List<PromotionResponseDTO>>> getPromotionData(@PathVariable("dong-code") Long dongCode){

        List<PromotionResponseDTO> result = promotionNetworkService.selectPromotions(dongCode);

        return ResponseEntity.status(HttpStatus.OK).body(BaseResponse.success(201, "데이터를 성공적으로 불러왔습니다.", result));
    }


    @Operation(summary = "행정동 청년인구당 홍보물 비율", description = "행정동의 홍보물, 유형 비율, 청년 인구 대비 수치 등 포함")
    @GetMapping("/{dong-code}")
    public ResponseEntity<BaseResponse<Double>> getPromotionDetail(
            @PathVariable("dong-code") Long dongCode) throws IOException {

        Double result = promotionNetworkService.calculatePromotionPerYouth(dongCode);
        return ResponseEntity.ok(BaseResponse.success(200, "홍보 거점 상세 조회 성공", result));
    }


}
package com.ssafy.backend.promotion_network.controller;

import com.ssafy.backend.common.dto.BaseResponse;
import com.ssafy.backend.promotion_network.model.response.PromotionNetworkResponseDTO;
import com.ssafy.backend.promotion_network.model.response.PromotionResponseDTO;
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
@Tag(name="PromotionNetwork", description = "홍보 네트워크망 관련 API")
public class PromotionNetworkController {

    private final PromotionNetworkService promotionNetworkService;

    @Operation(summary = "홍보 네트워크망 API", description = "홍보 네트워크망 대시보드 데이터에 대한 기능들입니다.")
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

    @GetMapping(value = "/{hangjungId}")
    public ResponseEntity<BaseResponse<List<PromotionResponseDTO>>> promotionData(@PathVariable("hangjungId") int hangjungId){

        List<PromotionResponseDTO> result = promotionNetworkService.selectPromotions(hangjungId);

        return ResponseEntity.status(HttpStatus.OK).body(BaseResponse.success(201, "데이터 불러오기 성공", result));
    }

}
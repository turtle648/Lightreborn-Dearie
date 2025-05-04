package com.ssafy.backend.youth_population.controller;

import com.ssafy.backend.common.dto.BaseResponse;
import com.ssafy.backend.youth_population.model.dto.response.YouthPopulationResponseDTO;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

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
}

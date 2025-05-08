package com.ssafy.backend.promotion_network.controller;

import com.opencsv.CSVWriter;
import com.ssafy.backend.common.dto.BaseResponse;
import com.ssafy.backend.promotion_network.model.response.*;
import com.ssafy.backend.promotion_network.service.PromotionNetworkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.List;
import java.util.Map;

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


    @Operation(summary = "특정 행정동의 홍보물 리스트 조회", description = "홍보물에 대한 정보 리스트를 조회합니다.")
    @GetMapping(value = "/{dong-code}/details")
    public ResponseEntity<BaseResponse<List<PromotionResponseDTO>>> getPromotionData(@PathVariable("dong-code") Long dongCode){

        List<PromotionResponseDTO> result = promotionNetworkService.selectPromotions(dongCode);

        return ResponseEntity.status(HttpStatus.OK).body(BaseResponse.success(201, "데이터를 성공적으로 불러왔습니다.", result));
    }


    @Operation(summary = "각 행정동의 청년인구당 홍보물 비율", description = "행정동의 홍보물비율 대비 청년 인구 수치를 조회합니다.")
    @GetMapping("/")
    public ResponseEntity<BaseResponse<List<PromotionPerYouthDto>>> getPromotionPerPopulation() throws IOException {

        List<PromotionPerYouthDto> result = promotionNetworkService.calculatePromotionPerYouth();
        return ResponseEntity.ok(BaseResponse.success(201, "홍보물 비율 조회 성공", result));
    }


    @Operation(summary = "행정동의 홍보물 유형 비율", description = "행정동의 홍보물별 유형 비율을 나타냅니다.")
    @GetMapping("/{dong-code}/ratio")
    public ResponseEntity<BaseResponse<Map<String, Double>>> getPromotionRatio(
            @PathVariable("dong-code") Long dongCode) throws IOException {

        Map<String, Double> result = promotionNetworkService.calculatePromotionTypeRatio(dongCode);
        return ResponseEntity.ok(BaseResponse.success(201, "행정동의 홍보물 유형 비율 조회 성공", result));
    }

    @Operation(summary = "행정동의 홍보물 비치장소 비율", description = "행정동의 홍보물이 어느 장소에 위치 했는지에 대한 비율을 조회합니다.")
    @GetMapping("/{dong-code}/placeRatio")
    public ResponseEntity<BaseResponse<Map<String, Double>>> getPromotionPlaceRatio(
            @PathVariable("dong-code") Long dongCode) throws IOException {

        Map<String, Double> result = promotionNetworkService.calculatePromotionPlaceTypeRatio(dongCode);
        return ResponseEntity.ok(BaseResponse.success(201, "행정동의 홍보물 유형 비율 조회 성공", result));
    }

    @Operation(summary = "행정동의 홍보물 상세정보 리스트 다운로드", description = "행정동의 홍보물에 대한 상세정보 리스트를 다운로드 합니다.")
    @GetMapping("/{dong-code}/file")
    public void exportPromotionData(@PathVariable("dong-code") Long dongCode, HttpServletResponse response) throws IOException {
        List<PromotionExportDTO> data = promotionNetworkService.selectPromotionExportData(dongCode);

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("홍보물 리스트");

        // 폰트 및 스타일 설정
        Font headerFont = workbook.createFont();
        headerFont.setBold(true);

        CellStyle headerStyle = workbook.createCellStyle();
        headerStyle.setFont(headerFont);
        headerStyle.setBorderTop(BorderStyle.THIN);
        headerStyle.setBorderBottom(BorderStyle.THIN);
        headerStyle.setBorderLeft(BorderStyle.THIN);
        headerStyle.setBorderRight(BorderStyle.THIN);

        CellStyle bodyStyle = workbook.createCellStyle();
        bodyStyle.setBorderTop(BorderStyle.THIN);
        bodyStyle.setBorderBottom(BorderStyle.THIN);
        bodyStyle.setBorderLeft(BorderStyle.THIN);
        bodyStyle.setBorderRight(BorderStyle.THIN);

        // 헤더 작성
        Row headerRow = sheet.createRow(0);
        String[] headers = {"장소명", "주소", "등록일", "홍보유형", "장소유형", "홍보정보"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // 데이터 작성
        for (int i = 0; i < data.size(); i++) {
            PromotionExportDTO dto = data.get(i);
            Row row = sheet.createRow(i + 1);

            String[] values = {
                    dto.getPlaceName(),
                    dto.getAddress(),
                    dto.getCreatedAt().toString(),
                    dto.getPromotionType(),
                    dto.getPromotionPlaceType(),
                    dto.getPromotionInformationContent()
            };

            for (int j = 0; j < values.length; j++) {
                Cell cell = row.createCell(j);
                cell.setCellValue(values[j]);
                cell.setCellStyle(bodyStyle);
            }
        }

        // 자동 열 너비 조정
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // HTTP 응답 설정
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=promotion_data.xlsx");

        workbook.write(response.getOutputStream());
        workbook.close();
    }
}
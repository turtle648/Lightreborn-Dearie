package com.ssafy.backend.welfare_center.controller;

import com.ssafy.backend.common.dto.BaseResponse;
import com.ssafy.backend.welfare_center.model.response.*;
import com.ssafy.backend.welfare_center.service.WelfareCenterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("welfare-centers")
@Tag(name="WelfareCenter", description = "협력 기관 관련 API")
public class WelfareCenterController {

    private final WelfareCenterService welfareCenterService;

    @Operation(summary = "협력 기관 API", description = "협력 기관 대시보드 데이터에 대한 기능들입니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "협력 기관 데이터 업데이트 성공"),
            @ApiResponse(responseCode = "400", description = "요청 값 오류"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @PostMapping(value = "/data", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BaseResponse<List<WelfareCenterDTO>>> uploadData(@RequestParam("file") MultipartFile file) throws IOException{

        List<WelfareCenterDTO> result = welfareCenterService.uploadAndProcess(file);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BaseResponse.success(201, "데이터 업로드를 성공했습니다.", result));
    }

    @Operation(summary = "전체 협력기관 위치 현황", description = "전체 협력기관 위치 데이터 조회 API")
    @GetMapping("/locations")
    public ResponseEntity<BaseResponse<List<WelfareCenterLocationDTO>>> getAllWelfareCenterLocations() {
        return ResponseEntity.ok(BaseResponse.success(
                200, "전체 협력기관 위치 현황 조회 성공",
                welfareCenterService.getAllWelfareCenterLocations()
        ));
    }

    @Operation(summary = "행정동 별 협력기관 위치 현황", description = "행정동 별 협력기관 위치 데이터 조회 API")
    @GetMapping("/{dong-code}/locations")
    public ResponseEntity<BaseResponse<List<WelfareCenterLocationDTO>>> getWelfareCenterLocationsByDong(@PathVariable("dong-code") String dongCode) {
        return ResponseEntity.ok(BaseResponse.success(
                200, "행정동 별 협력기관 위치 현황 조회 성공",
                welfareCenterService.getWelfareCenterLocationsByDong(dongCode)
        ));
    }

    @Operation(summary = "행정동 내 청년 인구 대비 협력기관 현황", description = "행정동 내 청년 인구 1만명 대비 협력기관 개수 조회 API")
    @GetMapping("/{dong-code}/youth-ratio")
    public ResponseEntity<BaseResponse<List<WelfareCenterYouthStatsDTO>>> getYouthRatioByDong(@PathVariable("dong-code") String dongCode) {
        return ResponseEntity.ok(BaseResponse.success(
                200, "행정동 내 청년 인구 대비 협력기관 현황 조회 성공",
                welfareCenterService.getYouthRatioByDong(dongCode)
        ));
    }

    @Operation(summary = "행정동 내 평균 대비 협력기관 현황", description = "양산시 평균 대비 행정동 내 협력기관 개수 비교 API")
    @GetMapping("/{dong-code}/average-comparison")
    public ResponseEntity<BaseResponse<List<WelfareCenterYouthStatsDTO>>> getAverageComparisonByDong(@PathVariable("dong-code") String dongCode) {
        return ResponseEntity.ok(BaseResponse.success(
                200, "행정동 내 평균 대비 협력기관 현황 조회 성공",
                welfareCenterService.getAverageComparisonByDong(dongCode)
        ));
    }

    @Operation(summary = "행정동 별 협력기관 현황 리스트", description = "행정동 별 협력기관 리스트 조회 API")
    @GetMapping("/{dong-code}/details")
    public ResponseEntity<BaseResponse<List<WelfareCenterDetailDTO>>> getWelfareCenterDetailsByDong(@PathVariable("dong-code") String dongCode) {
        return ResponseEntity.ok(BaseResponse.success(
                200, "행정동 별 협력기관 리스트 조회 성공",
                welfareCenterService.getWelfareCenterDetailsByDong(dongCode)
        ));
    }

    @Operation(summary = "전체 협력기관 현황 리스트", description = "전체 협력기관 리스트 조회 API")
    @GetMapping("/details")
    public ResponseEntity<BaseResponse<List<WelfareCenterDetailDTO>>> getAllWelfareCenterDetails() {
        return ResponseEntity.ok(BaseResponse.success(
                200, "전체 협력기관 리스트 조회 성공",
                welfareCenterService.getAllWelfareCenterDetails()
        ));
    }

    @Operation(summary = "협력기관 대시보드 통합 조회", description = "협력기관 위치, 청년 인구 대비 현황, 평균 대비 현황, 리스트 등 대시보드용 통합 데이터 조회 API")
    @GetMapping("/summary")
    public ResponseEntity<BaseResponse<WelfareCenterSummaryDTO>> getDashboardSummary() {
        return ResponseEntity.ok(BaseResponse.success(
                200, "협력기관 대시보드 통합 데이터 조회 성공",
                welfareCenterService.getDashboardSummary()
        ));
    }

    @Operation(summary = "전체 협력기관 엑셀 다운로드", description = "전체 협력기관 리스트 엑셀 파일 다운로드 API")
    @GetMapping("/files")
    public void exportWelfareCenterData(HttpServletResponse response) throws IOException {
        List<WelfareCenterExportDTO> data = welfareCenterService.getAllWelfareCenterExportData();

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("협력기관 리스트");

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
        String[] headers = {"협력기관명", "협력기관 분류", "주소", "전화번호"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // 데이터 작성
        for (int i = 0; i < data.size(); i++) {
            WelfareCenterExportDTO dto = data.get(i);
            Row row = sheet.createRow(i + 1);

            String[] values = {
                    dto.getOrganizationName(),
                    dto.getType(),
                    dto.getAddress(),
                    dto.getPhoneNumber()
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
        response.setHeader("Content-Disposition", "attachment; filename=welfare_centers.xlsx");

        workbook.write(response.getOutputStream());
        workbook.close();
    }
}

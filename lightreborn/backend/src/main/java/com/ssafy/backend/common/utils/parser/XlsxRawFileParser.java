package com.ssafy.backend.common.utils.parser;

import com.ssafy.backend.common.utils.HeaderMapping;
import com.ssafy.backend.common.utils.enums.FileType;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.StreamSupport;

@Slf4j
@Component
public class XlsxRawFileParser implements RawFileParser {

    private final Set<String> STRING_FIELDS = Set.of("hanjungCode");
    private final DataFormatter dataFormatter = new DataFormatter();

    @Override
    public List<Map<String, String>> parse(MultipartFile file, FileType fileType) throws IOException {

        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is) ) {
            log.info("xlsx 파싱 시작", file.getOriginalFilename());

            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();

            if(!rowIterator.hasNext()) {
                return Collections.emptyList();
            }

            //1. 헤더 행 읽어서 영어 키로 치환.
            Row headerRow = rowIterator.next();
            List<String> headers = new ArrayList<>();
            for(Cell cell : headerRow){
                String raw = cell.getStringCellValue().trim();
                headers.add(HeaderMapping.HEADER_ALIAS.get(fileType).getOrDefault(raw, raw));
            }

            //2. 나머지 데이터 행 파싱
            List<Map<String,String>> rows = new ArrayList<>();
            while(rowIterator.hasNext()){
                Row row = rowIterator.next();
                Map<String, String> map = new HashMap<>();
                for(int i = 0; i < headers.size(); i++){

                    Cell cell = row.getCell(i, Row.MissingCellPolicy.CREATE_NULL_AS_BLANK);
                    String value = getCellValueAsString(cell, headers.get(i));
                    log.info("{}={}", headers.get(i), value);

                    map.put(headers.get(i), value);
                }
                rows.add(map);
                log.info("set-----");
            }
            return rows;
        }
    }

    private String getCellValueAsString(Cell cell, String headerKey) {
        if(cell == null) return "";

        if(STRING_FIELDS.contains(headerKey)) {
            return dataFormatter.formatCellValue(cell);
        }

        return switch(cell.getCellType()){
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> DateUtil.isCellDateFormatted(cell)
                    ?cell.getLocalDateTimeCellValue().toLocalDate().toString()
                    :cleanNumericValue(cell.getNumericCellValue());
            case BOOLEAN -> Boolean.toString(cell.getBooleanCellValue());
            case FORMULA -> cell.getCellFormula();
            default -> "";
        };
    }

    private String cleanNumericValue(double value) {
        if(value == Math.floor(value)){
            return String.valueOf((long)value);
        }
        else{
            return String.valueOf(value);
        }
    }

    @Override
    public boolean supports(String extension) {
        return ".xlsx".equalsIgnoreCase(extension);
    }

    @Override
    public List<String> extractHeaders(MultipartFile file) throws IOException {
        try(Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Row headerRow = workbook.getSheetAt(0).getRow(0);
            return StreamSupport.stream(headerRow.spliterator(), false)
                    .map(Cell::getStringCellValue)
                    .map(String::trim)
                    .toList();
        }
    }
}

package com.ssafy.backend.common.utils.parser;

import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvException;
import com.ssafy.backend.common.utils.HeaderMapping;
import com.ssafy.backend.common.utils.enums.FileType;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.input.BOMInputStream;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Slf4j
@Component
public class CsvRawFileParser implements RawFileParser {
    @Override
    public List<Map<String, String>> parse(MultipartFile file, FileType fileType) throws IOException {
        try (
             BOMInputStream bis = new BOMInputStream(file.getInputStream());
             Reader reader = new InputStreamReader(bis, StandardCharsets.UTF_8);
             CSVReader csv = new CSVReaderBuilder(reader)
                     .withSkipLines(0) //헤더도 포함
                     .build()
        ) {
            log.info("csv 파싱 시작", file.getOriginalFilename());

            Iterator<String[]> iterator = csv.iterator();

            if(!iterator.hasNext()) {
                return Collections.emptyList();
            }

            //1. 헤더를 읽고 치환
            String[] rawHeaders = iterator.next();
            List<String> headers = Arrays.stream(rawHeaders)
                    .map(h -> HeaderMapping.HEADER_ALIAS.get(fileType).getOrDefault(h.trim(), h.trim()))
                    .toList();

            log.info("headers: {}", headers);

            //2. 나머지 행들 map으로 변환
            List<Map<String, String>> result = new ArrayList<>();
            while(iterator.hasNext()) {
                String[] cols = iterator.next();
                log.info("cols: {}", Arrays.toString(cols));

                Map<String, String> rowMap = new HashMap<>();
                for (int j = 0; j < headers.size() && j < cols.length; j++) {
                    log.info("header: {}", headers.get(j));
                    rowMap.put(headers.get(j), cols[j].trim());
                }
                result.add(rowMap);
            }
            return result;
        }
    }

    @Override
    public boolean supports(String extension) {
        return ".csv".equalsIgnoreCase(extension);
    }

    @Override
    public List<String> extractHeaders(MultipartFile file) throws IOException {
        try(
            BOMInputStream bis = new BOMInputStream(file.getInputStream());
            Reader reader = new InputStreamReader(bis, StandardCharsets.UTF_8);
            CSVReader csv = new CSVReaderBuilder(reader).withSkipLines(0).build()
        )
        {
            String[] raw;
            try {
                raw = csv.readNext();
            }catch(CsvException e)
            {
                throw new IOException("readNext(): CSV 파싱 중 오류 발생", e);
            }

            return Arrays.stream(raw)
                    .map(String::trim)
                    .toList();
        }
    }
}

package com.ssafy.backend.common.utils.parser;

import com.ssafy.backend.common.utils.enums.FileType;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface RawFileParser {

    /**
     * @param file 사용자가 업로드한 파일
     * @return 각 행을 헤더 -> 값 으로 파싱한 결과
     * */
    List<Map<String, String>> parse(MultipartFile file, FileType fileType) throws IOException;

    /**
    * @param extension  .csv, .xlsx와 같은 확장자 명
    * @return 지원하는 확장자 명 인지 확인
    * */
    boolean supports(String extension);

    /**
     *
     * @return xlsx의 헤더를 반환
     * */
    List<String> extractHeaders(MultipartFile file) throws IOException;
}

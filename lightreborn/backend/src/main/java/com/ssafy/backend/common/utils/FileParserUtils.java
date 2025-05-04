package com.ssafy.backend.common.utils;

import com.ssafy.backend.common.utils.parser.RawFileParser;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class FileParserUtils {

    private FileParserUtils() {} //인스턴스화 방지

    /**
     * @param actualHeaders 업로드된 파일의 헤더 목록
     * @param requiredHeaders 필수 헤더 목록
     * @return 데이터 업로드시 누락된 필수 헤더
     * */
    public static Set<String> findMissingHeaders(List<String> actualHeaders, Set<String> requiredHeaders) {
        return requiredHeaders.stream()
                .filter(key -> !actualHeaders.contains(key))
                .collect(Collectors.toSet());
    }

    /**
     * @param filename 업로드 한 파일의 이름
     * @param parsers 파싱을 지원하는 파서들
     * @return 확장자 명에 맞는 파서
     * */
    public static RawFileParser resolveParser(String filename, List<RawFileParser> parsers){
        String extension = filename.substring(filename.lastIndexOf("."));

        return parsers.stream()
                .filter(p -> p.supports(extension))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("지원하지 않는 파일 형식입니다." + extension));
    }
}

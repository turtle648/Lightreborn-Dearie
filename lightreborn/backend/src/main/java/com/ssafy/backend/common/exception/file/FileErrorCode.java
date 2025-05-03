package com.ssafy.backend.common.exception.file;

import com.ssafy.backend.common.exception.BaseErrorCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum FileErrorCode implements BaseErrorCode {
    INVALID_DATA(HttpStatus.BAD_REQUEST, "유효하지 않은 데이터입니다."),
    MISSING_HEADERS(HttpStatus.BAD_REQUEST, "필수 헤더가 누락됐습니다.");

    private final HttpStatus status;
    private final String message;
}

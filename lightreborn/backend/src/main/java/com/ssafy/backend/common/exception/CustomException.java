package com.ssafy.backend.common.exception;

import lombok.Getter;

@Getter
public class CustomException extends RuntimeException {
    private final ErrorCode errorCode;

    public CustomException(ErrorCode errorCode) {
        super(errorCode.getMessage()); // Exception 기본 메시지 설정
        this.errorCode = errorCode;
    }
}

package com.ssafy.backend.common.exception;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public abstract class ErrorResponse {
    private final LocalDateTime timestamp;
    private final int status;
    private final String error;
    private final String message;

    protected ErrorResponse(BaseErrorCode errorCode) { // ✅ protected로 선언하여 서브클래스에서만 사용 가능
        this.timestamp = LocalDateTime.now();
        this.status = errorCode.getStatus().value();
        this.error = errorCode.getStatus().getReasonPhrase();
        this.message = errorCode.getMessage();

    }
}

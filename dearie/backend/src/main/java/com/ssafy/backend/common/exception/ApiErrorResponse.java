package com.ssafy.backend.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
public class ApiErrorResponse extends ErrorResponse {
    private final String code;
    private final List<FieldErrorDetail> fieldErrors;

    public ApiErrorResponse(BaseErrorCode errorCode) {
        this(errorCode, null);
    }

    public ApiErrorResponse(BaseErrorCode errorCode, List<FieldErrorDetail> fieldErrors) {
        super(errorCode);
        this.code = errorCode.name();
        this.fieldErrors = fieldErrors;
    }

    @Getter
    @AllArgsConstructor
    public static class FieldErrorDetail {
        private final String field;
        private final String reason;
    }
}

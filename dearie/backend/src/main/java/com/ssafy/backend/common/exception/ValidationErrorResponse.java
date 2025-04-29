package com.ssafy.backend.common.exception;

import lombok.Getter;

import java.util.List;

@Getter
public class ValidationErrorResponse extends ErrorResponse {
    private final List<FieldErrorDetail> fieldErrors;

    public ValidationErrorResponse(ErrorCode errorCode, List<FieldErrorDetail> fieldErrors) {
        super(errorCode);
        this.fieldErrors = fieldErrors;
    }

    @Getter
    public static class FieldErrorDetail {
        private final String field;
        private final String message;

        public FieldErrorDetail(String field, String message) {
            this.field = field;
            this.message = message;
        }
    }
}

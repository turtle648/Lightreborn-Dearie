package com.ssafy.backend.common.exception;

import io.swagger.v3.oas.annotations.Hidden;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
@Hidden  // Swagger 문서에서 이 클래스 제외
public class GlobalExceptionHandler {
    // ✅ CustomException 처리
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiErrorResponse> handleCustomException(CustomException ex) {
        log.error("[Common Error] {}", ex.getMessage());

        return new ResponseEntity<>(new ApiErrorResponse(ex.getErrorCode()), ex.getErrorCode().getStatus());
    }

    // ✅ Validation 예외 (입력값 검증 실패) 처리
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        BindingResult bindingResult = ex.getBindingResult();

        log.error("[Validation Error] {}", ex.getMessage());

        // 필드별 오류 메시지를 리스트로 변환
        List<ValidationErrorResponse.FieldErrorDetail> fieldErrors = bindingResult.getFieldErrors().stream()
                .map(error -> new ValidationErrorResponse.FieldErrorDetail(error.getField(), error.getDefaultMessage()))
                .collect(Collectors.toList());

        return new ResponseEntity<>(new ValidationErrorResponse(ErrorCode.INVALID_REQUEST, fieldErrors), HttpStatus.BAD_REQUEST);
    }

    // ✅ 기타 모든 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleException(Exception ex) {
        log.error("[Unhandled Exception] {}", ex.getClass().getSimpleName(), ex);
        return new ResponseEntity<>(new ApiErrorResponse(ErrorCode.INTERNAL_SERVER_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

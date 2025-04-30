package com.ssafy.backend.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BaseResponse<T> {
    private int code;
    private String message;
    private T result;

    public static <T> BaseResponse<T> success(T result) {
        return BaseResponse.<T>builder()
                .code(200)
                .message("요청에 성공했습니다.")
                .result(result)
                .build();
    }

    public static <T> BaseResponse<T> success(String message, T result) {
        return BaseResponse.<T>builder()
                .code(200)
                .message(message)
                .result(result)
                .build();
    }

    public static <T> BaseResponse<T> success(int code, String message) {
        return BaseResponse.<T>builder()
                .code(code)
                .message(message)
                .build();
    }

    public static <T> BaseResponse<T> success(int code, String message, T result) {
        return BaseResponse.<T>builder()
                .code(code)
                .message(message)
                .result(result)
                .build();
    }
}

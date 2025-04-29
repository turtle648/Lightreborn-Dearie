package com.ssafy.backend.common.exception;

import org.springframework.http.HttpStatus;

public interface BaseErrorCode {
    HttpStatus getStatus();
    String getMessage();
    String name();
}

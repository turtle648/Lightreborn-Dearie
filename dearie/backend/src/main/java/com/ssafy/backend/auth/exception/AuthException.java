package com.ssafy.backend.auth.exception;

import com.ssafy.backend.common.exception.CustomException;
import lombok.Getter;

@Getter
public class AuthException extends CustomException {
    public AuthException(AuthErrorCode errorCode) {
        super(errorCode);
    }
}

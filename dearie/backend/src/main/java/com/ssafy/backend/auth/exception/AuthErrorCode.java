package com.ssafy.backend.auth.exception;

import com.ssafy.backend.common.exception.BaseErrorCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum AuthErrorCode implements BaseErrorCode {
    ID_REQUIRED(HttpStatus.BAD_REQUEST, "id는 필수입니다."),
    PASSWORD_REQUIRED(HttpStatus.BAD_REQUEST, "비밀번호는 필수입니다."),
    NAME_REQUIRED(HttpStatus.BAD_REQUEST, "이름은 필수입니다."),
    NICKNAME_REQUIRED(HttpStatus.BAD_REQUEST, "닉네임은 필수입니다."),
    GENDER_REQUIRED(HttpStatus.BAD_REQUEST, "성별은 필수입니다."),
    BIRTHDATE_REQUIRED(HttpStatus.BAD_REQUEST, "생일은 필수입니다."),
    AGE_REQUIRED(HttpStatus.BAD_REQUEST, "나이는 필수입니다."),
    PHONE_REQUIRED(HttpStatus.BAD_REQUEST, "전화번호는 필수입니다."),

    USER_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 존재하는 사용자입니다."),
    USER_NOT_FOUND(HttpStatus.BAD_REQUEST, "존재하지 않는 사용자입니다."),
    PASSWORD_NOT_MATCH(HttpStatus.BAD_REQUEST, "패스워드가 일치하지 않습니다.");

    private final HttpStatus status;
    private final String message;
}

package com.ssafy.backend.youth_consultation.exception;

import com.ssafy.backend.common.exception.BaseErrorCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum YouthConsultationErrorCode implements BaseErrorCode {
    NO_MATCH_SURVEY(HttpStatus.BAD_REQUEST, "일치하는 설문 응답이 없습니다."),
    NO_MATCH_COUNSELING(HttpStatus.BAD_REQUEST, "일치하는 상담 일정이 없습니다."),
    NO_MATCH_PERSON(HttpStatus.BAD_REQUEST, "일치하는 고립청년이 없습니다.");

    private final HttpStatus status;
    private final String message;
}

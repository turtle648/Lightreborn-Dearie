package com.ssafy.backend.survey.exception;

import com.ssafy.backend.common.exception.BaseErrorCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum SurveyErrorCode implements BaseErrorCode {
    OPTION_NOT_FOUND(HttpStatus.BAD_REQUEST, "잘못된 보기입니다."),
    QUESTION_NOT_FOUND(HttpStatus.BAD_REQUEST, "질문을 찾을 수 없습니다."),
    ANSWER_TEXT_REQUIRED(HttpStatus.BAD_REQUEST, "답변 텍스트는 필수입니다."),
    ANSWER_CHOICE_REQUIRED(HttpStatus.BAD_REQUEST, "객관식 답변 선택은 필수입니다."),
    SURVEY_QUESTION_REQUIRED(HttpStatus.BAD_REQUEST, "설문 문항 정보가 필요합니다."),
    SURVEY_REQUIRED(HttpStatus.BAD_REQUEST, "설문 정보가 필요합니다.");

    private final HttpStatus status;
    private final String message;
}

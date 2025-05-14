package com.ssafy.backend.survey.exception;

import com.ssafy.backend.common.exception.CustomException;
import lombok.Getter;

@Getter
public class SurveyException extends CustomException {
    public SurveyException(SurveyErrorCode errorCode) {
        super(errorCode);
    }
}

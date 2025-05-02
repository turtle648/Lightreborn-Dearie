package com.ssafy.backend.youth_consultation.exception;

import com.ssafy.backend.common.exception.CustomException;

public class YouthConsultationException extends CustomException {
    public YouthConsultationException(YouthConsultationErrorCode errorCode) {
        super(errorCode);
    }
}

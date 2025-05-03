package com.ssafy.backend.common.exception.file;

import com.ssafy.backend.common.exception.CustomException;

public class FileParsingException extends CustomException {

    public FileParsingException(FileErrorCode errorCode) {
        super(errorCode);
    }
}

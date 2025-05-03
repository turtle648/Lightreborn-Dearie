package com.ssafy.backend.common.exception.file;

import lombok.Getter;
import java.util.Set;

@Getter
public class MissingHeadersException extends FileParsingException {
    private final Set<String> missingHeaders;

    public MissingHeadersException(Set<String> missingHeaders) {
        super(FileErrorCode.MISSING_HEADERS);
        this.missingHeaders = missingHeaders;
    }
}

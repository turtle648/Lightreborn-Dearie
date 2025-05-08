package com.ssafy.backend.youth_consultation.model.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ExportCounselingLogResponseDTO {
    private byte[] fileContent;
    private String fileName;
    private String contentType;
    private long fileSize;
    private String generatedAt;
}

package com.ssafy.backend.youth_consultation.model.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Builder
@Schema(name = "SpeechUploadRequest", description = "음성 업로드 요청")
public class SpeechRequestDTO {
    @Schema(description = "업로드할 음성 파일 (.m4a 등)", type = "string", format = "binary", required = true)
    private MultipartFile file;

    @Schema(description = "고립 청년 ID", example = "1", required = true)
    private Long counselingLogId;
}

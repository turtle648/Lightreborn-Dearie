package com.ssafy.backend.youth_consultation.model.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Getter
@ToString
public class UpdateCounselingLogRequestDTO {
    @Schema(description = "요약", example = "summary")
    private String summary;

    @Schema(description = "내담자 키워드", example = "client")
    private String client;

    @Schema(description = "상담자 키워드", example = "counselor")
    private String counselor;

    @Schema(description = "메모 / 특이사항", example = "memos")
    private String memos;
}

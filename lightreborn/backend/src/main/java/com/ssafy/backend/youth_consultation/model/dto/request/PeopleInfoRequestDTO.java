package com.ssafy.backend.youth_consultation.model.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class PeopleInfoRequestDTO {
    @Schema(description = "이름", example = "홍길동")
    private String name;

    @Schema(description = "페이지 번호", defaultValue = "0", example = "0")
    private int pageNum = 0;

    @Schema(description = "페이지 크기", defaultValue = "5", example = "5")
    private int sizeNum = 5;
}

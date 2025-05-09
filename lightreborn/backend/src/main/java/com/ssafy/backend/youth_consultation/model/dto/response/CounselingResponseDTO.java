package com.ssafy.backend.youth_consultation.model.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CounselingResponseDTO {
    private Long counselingId;
    private String type;
    private String counselor;
    private LocalDateTime consultationDate;
    private String memoKeyword;
}

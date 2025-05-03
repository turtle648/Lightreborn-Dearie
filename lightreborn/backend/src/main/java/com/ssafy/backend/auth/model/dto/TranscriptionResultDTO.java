package com.ssafy.backend.auth.model.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TranscriptionResultDTO {
    private String transcript;
    private String uploadUrl;
}

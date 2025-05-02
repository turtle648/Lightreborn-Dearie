package com.ssafy.backend.youth_consultation.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SpeechResponseDTO {
    String transcript;
    String summary;
    String client;
    String counselor;
    String memos;
}

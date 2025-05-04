package com.ssafy.backend.youth_consultation.model.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SpeechResponseDTO {
    public String transcript;
    public String summary;
    public String client;
    public String counselor;
    public String memos;
}

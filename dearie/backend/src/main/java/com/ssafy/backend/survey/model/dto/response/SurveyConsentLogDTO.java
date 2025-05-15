package com.ssafy.backend.survey.model.dto.response;

import com.ssafy.backend.survey.model.entity.SurveyConsentLog;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class SurveyConsentLogDTO {
    private Long agreementId;
    private Boolean isAgreed;
    private LocalDateTime agreedAt;

    public static SurveyConsentLogDTO from (SurveyConsentLog log) {
        return SurveyConsentLogDTO.builder()
                .agreementId(log.getId())
                .isAgreed(log.getIsAgreed())
                .agreedAt(log.getAgreedAt())
                .build();
    }
}

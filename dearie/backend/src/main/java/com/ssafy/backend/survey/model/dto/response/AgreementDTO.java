package com.ssafy.backend.survey.model.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AgreementDTO {
    private String title;
    private String purpose;
    private String items;
    private String retentionPeriod;
    private boolean isRequired;
}

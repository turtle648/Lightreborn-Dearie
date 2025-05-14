package com.ssafy.backend.survey.model.dto.response;

import com.ssafy.backend.survey.model.entity.SurveyConsent;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AgreementDTO {
    private Long agreementId;
    private String title;
    private String purpose;
    private String items;
    private String retentionPeriod;
    private boolean isRequired;

    public static AgreementDTO from(SurveyConsent consent) {
        return AgreementDTO.builder()
                .agreementId(consent.getId())
                .title(consent.getTitle())
                .purpose(consent.getPurpose())
                .items(consent.getItems())
                .retentionPeriod(consent.getPeriod())
                .isRequired(consent.getIsRequired())
                .build();
    }
}

package com.ssafy.backend.survey.model.collector;

import com.ssafy.backend.survey.model.dto.response.AgreementDTO;

import java.util.ArrayList;
import java.util.List;

public class AgreementCollector {
    private final List<AgreementDTO> agreementDTOS = new ArrayList<>();

    public void add (AgreementDTO agreementDTO) {
        agreementDTOS.add(agreementDTO);
    }

    public List<AgreementDTO> getAgreementDTOS() {
        return List.copyOf(agreementDTOS);
    }
}

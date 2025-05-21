package com.ssafy.backend.youth_consultation.model.dto.response;

import com.ssafy.backend.youth_consultation.model.entity.SurveyProcessStep;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PreSupportIsolatedYouthResponseDTO {
    String name;
    int age;
    String processStep;
}

package com.ssafy.backend.youth_consultation.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class IsolatedYouthResponseDTO {
    private final String name;
    private final int age;
    private final String processStep;
    private final LocalDateTime recentSurveyDate;
    private final String memoKeyword;
}

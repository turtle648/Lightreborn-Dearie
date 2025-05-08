package com.ssafy.backend.youth_consultation.model.dto.response;

import com.ssafy.backend.youth_consultation.model.entity.IsolationLevel;
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
    private final IsolationLevel isolationLevel;
    private final LocalDateTime recentSurveyDate;
    private final String memoKeyword;
}

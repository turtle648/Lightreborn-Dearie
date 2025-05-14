package com.ssafy.backend.survey.model.state;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum SurveyType {
    OBJECTIVE, // 객관
    SUBJECTIVE; // 서술
}

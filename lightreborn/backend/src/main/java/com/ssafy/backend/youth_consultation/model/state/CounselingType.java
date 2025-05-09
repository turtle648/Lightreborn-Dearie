package com.ssafy.backend.youth_consultation.model.state;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CounselingType {
    INITIAL("초기상담"),
    REGULAR("정기상담");

    private final String description;

    public static String determineType(int pageNumber, int index) {
        return (pageNumber == 0 && index == 0) ? INITIAL.getDescription() : REGULAR.getDescription();
    }
}
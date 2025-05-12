package com.ssafy.backend.auth.model.state;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Arrays;

@Getter
@AllArgsConstructor
public enum Gender {
    MALE("남성"),
    FEMALE("여성");

    private final String label;

    public static Gender from(String code) {
        return Arrays.stream(values())
                .filter(g -> g.name().equalsIgnoreCase(code))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("잘못된 성별 코드: " + code));
    }
}

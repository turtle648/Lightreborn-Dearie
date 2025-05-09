package com.ssafy.backend.welfare_center.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WelfareCenterLocationDTO {
    private String organizationName; // 기관명
    private double latitude;   // 위도
    private double longitude;  // 경도
}

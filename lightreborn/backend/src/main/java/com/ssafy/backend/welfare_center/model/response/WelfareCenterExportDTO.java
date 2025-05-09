package com.ssafy.backend.welfare_center.model.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true) //연관관계 필드 설정을 위해 추가
public class WelfareCenterExportDTO {
    private String organizationName; // 기관명
    private String type;             // 기관 분류
    private String address;          // 주소
    private String phoneNumber;      // 전화번호
}

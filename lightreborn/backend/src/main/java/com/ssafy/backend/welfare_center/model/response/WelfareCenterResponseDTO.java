package com.ssafy.backend.welfare_center.model.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true) //연관관계 필드 설정을 위해 추가
public class WelfareCenterResponseDTO {
    private Long id;
    private String address;
    private String organizationName;
    private String type;
    private String phoneNumber;
    private Double latitude;
    private Double longitude;
    private Long hangjungId;
}

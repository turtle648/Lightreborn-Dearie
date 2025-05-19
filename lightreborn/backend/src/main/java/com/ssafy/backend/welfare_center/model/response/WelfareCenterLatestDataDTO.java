package com.ssafy.backend.welfare_center.model.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@JsonIgnoreProperties(ignoreUnknown = true) //연관관계 필드 설정을 위해 추가
public class WelfareCenterLatestDataDTO {
    private String organizationName;
    private String address;
    private String callNumber;
    private Double latitude;
    private Double longitude;
    private String hangjungCode;
    private String hangjungName;
    private String organizationType;
}

package com.ssafy.backend.welfare_center.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WelfareCenterDetailDTO {
    private Long id;
    private Long hangjungId;
    private String address;
    private String organizationName;
    private String type;
    private String phoneNumber;
}

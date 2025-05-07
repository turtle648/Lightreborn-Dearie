package com.ssafy.backend.youth_consultation.model.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ToString
@Getter
@Builder
public class YouthInfoBriefDTO {
    private Long id;
    private String name;
}

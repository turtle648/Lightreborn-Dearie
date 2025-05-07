package com.ssafy.backend.youth_consultation.model.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
@ToString
@Getter
@Builder
public class PeopleInfoResponseDTO {
    int totalPages;
    long totalElements;
    int currentPage;
    List<String> youthInfo;
}

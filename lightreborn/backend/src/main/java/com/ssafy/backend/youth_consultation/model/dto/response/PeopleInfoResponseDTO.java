package com.ssafy.backend.youth_consultation.model.dto.response;

import com.ssafy.backend.youth_consultation.model.dto.YouthInfoBriefDTO;
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
    List<YouthInfoBriefDTO> youthInfos;
}

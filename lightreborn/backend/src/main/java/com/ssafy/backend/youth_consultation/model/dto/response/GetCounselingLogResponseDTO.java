package com.ssafy.backend.youth_consultation.model.dto.response;

import com.ssafy.backend.youth_consultation.model.entity.CounselingLog;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
@ToString
@Getter
@Builder
public class GetCounselingLogResponseDTO {
    int totalPages;
    long totalElements;
    int currentPage;
    List<CounselingLog> counselingLogs;
}

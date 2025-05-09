package com.ssafy.backend.youth_consultation.model.collector;

import com.ssafy.backend.youth_consultation.model.dto.response.CounselingResponseDTO;
import com.ssafy.backend.youth_consultation.model.entity.CounselingLog;
import com.ssafy.backend.youth_consultation.model.state.CounselingType;
import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.stream.IntStream;

@Getter
public class CounselingResponseCollector {
    private final List<CounselingResponseDTO> counselingResponseDTOS;

    public CounselingResponseCollector(Page<CounselingLog> counselingLogPage) {
        this.counselingResponseDTOS = this.convertToDTOs(counselingLogPage, counselingLogPage.getContent());
    }

    private List<CounselingResponseDTO> convertToDTOs(Page<CounselingLog> counselingLogPage, List<CounselingLog> counselingLogs) {
        return IntStream.range(0, counselingLogs.size())
                .mapToObj(i -> {
                    CounselingLog log = counselingLogs.get(i);
                    String type = CounselingType.determineType(counselingLogPage.getNumber(), i);
                    return CounselingResponseDTO.builder()
                            .counselingId(log.getId())
                            .type(type)
                            .memoKeyword(log.getMemoKeyword())
                            .consultationDate(log.getConsultationDate())
                            .counselor(log.getUser().getName())
                            .build();
                })
                .toList();
        }
}

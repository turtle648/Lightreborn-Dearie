package com.ssafy.backend.diary.model.dto.response;

import com.ssafy.backend.diary.model.entity.Diary;
import lombok.Getter;
import lombok.Builder;

import java.time.LocalDateTime;

@Getter
@Builder
public class GetDiaryReportDTO {
    private Long id;
    private String content;
    private LocalDateTime createdAt;

    public static GetDiaryReportDTO fromEntity(Diary diary) {
        return GetDiaryReportDTO.builder()
                .id(diary.getId())
                .content(diary.getContent())
                .createdAt(diary.getCreatedAt())
                .build();
    }
}

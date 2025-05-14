package com.ssafy.backend.diary.model.response;

import com.ssafy.backend.diary.model.entity.Diary;
import org.springframework.data.domain.Page;

import java.util.List;

public record DiaryListResponse(
    List<DiaryListItemDto> result,
    int page,
    int size,
    long totalElements,
    int totalPages,
    boolean last
) {
    public DiaryListResponse(List<DiaryListItemDto> items, Page<Diary> page) {
        this(items, page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages(), page.isLast());
    }
}
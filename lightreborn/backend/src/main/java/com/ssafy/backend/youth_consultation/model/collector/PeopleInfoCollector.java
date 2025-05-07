package com.ssafy.backend.youth_consultation.model.collector;

import com.ssafy.backend.youth_consultation.model.dto.response.PeopleInfoResponseDTO;
import com.ssafy.backend.youth_consultation.model.entity.IsolatedYouth;
import org.springframework.data.domain.Page;

import java.util.List;

public class PeopleInfoCollector {
    private final Page<IsolatedYouth> pages;

    public PeopleInfoCollector(Page<IsolatedYouth> pages) {
        this.pages = pages;
    }

    public PeopleInfoResponseDTO getResponseDto() {
        int currentPage = pages.getNumber();
        long totalElements = pages.getTotalElements();
        int totalPages = pages.getTotalPages();
        List<String> names = pages.getContent()
                .stream()
                .map(page ->
                        page.getPersonalInfo()
                                .getName())
                .toList();

        return PeopleInfoResponseDTO.builder()
                .currentPage(currentPage)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .youthInfo(names)
                .build();
    }
}

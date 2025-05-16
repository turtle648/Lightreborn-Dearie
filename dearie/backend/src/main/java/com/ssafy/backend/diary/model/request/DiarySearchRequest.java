package com.ssafy.backend.diary.model.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DiarySearchRequest {

    @Schema(description = "정렬 기준 (기본값: latest)", example = "latest", defaultValue = "latest", allowableValues = {"latest", "oldest"})
    private String sort = "latest";            // 최신순(기본값) 또는 오래된순

    @Schema(description = "검색어(내용 키워드) - 입력 없으면 모든 일기 조회", example = "여행", nullable = true)
    private String keyword;                    // 검색어(내용 키워드)

    @Schema(description = "북마크 여부 - true: 북마크된 일기만, false: 모든 일기 조회", example = "false", nullable = true)
    private Boolean bookmark;                  // 북마크 여부

    @Schema(description = "페이지 번호 (0부터 시작, 기본값: 0)", example = "0", defaultValue = "0")
    private int page = 0;                      // 0페이지부터 시작 (첫 페이지)

    @Schema(description = "페이지당 일기 수 (기본값: 10)", example = "10", defaultValue = "10")
    private int size = 10;                     // 페이지당 10개 일기
}
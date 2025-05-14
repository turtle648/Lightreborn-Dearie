package com.ssafy.backend.common.client.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ItunesSearchResponse {
    private int resultCount;
    private List<ItunesResult> results;
}
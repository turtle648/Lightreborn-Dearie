package com.ssafy.backend.common.client.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItunesResult {
    @JsonProperty("artistName")
    private String artistName;

    @JsonProperty("trackName")
    private String trackName;

    @JsonProperty("artworkUrl100")
    private String artworkUrl100;

}
package com.ssafy.backend.mission.model.dto.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
public class MusicResultDetail {
    String title;
    String artist;
    String thumbnailImageUrl;
    boolean isVerified;
}

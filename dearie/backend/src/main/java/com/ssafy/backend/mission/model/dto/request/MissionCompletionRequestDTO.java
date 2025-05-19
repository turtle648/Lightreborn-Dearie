package com.ssafy.backend.mission.model.dto.request;

import com.ssafy.backend.mission.model.enums.MissionResultType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Schema(description = "미션 검증 요청 DTO")
@Getter
@Setter
public class MissionCompletionRequestDTO {
    @NotNull
    private Long missionId;
    
    @NotNull
    private MissionResultType missionResultType;

    //이미지 미션
    MultipartFile imageFile;
    String imageKeyword;
    Double longitude;
    Double latitude;

    //음악 감상 미션
    private String title;
    private String artist;
    private String musicImageUrl;
    
    //텍스트 미션
    private String textContent;

    // 산책 미션
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime startTime;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime endTime;
//    private MultipartFile snapshotFile;
    private String pathJson;
    private double distance;  // 단위: km
}
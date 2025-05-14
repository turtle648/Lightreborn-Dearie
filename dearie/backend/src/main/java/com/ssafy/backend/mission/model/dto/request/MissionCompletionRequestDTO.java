package com.ssafy.backend.mission.model.dto.request;

import com.ssafy.backend.mission.model.enums.MissionResultType;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

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

    //음악 감상 미션
    private String title;
    private String artist;
    private String musicImageUrl;
    
    //텍스트 미션
    private String textContent;
}
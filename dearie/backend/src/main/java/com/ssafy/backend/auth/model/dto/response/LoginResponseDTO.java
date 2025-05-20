package com.ssafy.backend.auth.model.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ssafy.backend.auth.model.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoginResponseDTO {
    private String id;
    private String name;
    private String nickName;
    private String profileImage;

    private UserActivityDTO userActivity;

    public static LoginResponseDTO from (User user, UserActivityDTO userActivity) {
        return LoginResponseDTO.builder()
                .id(user.getLoginId())
                .name(user.getName())
                .nickName(user.getNickname())
                .profileImage(user.getProfileImg())
                .userActivity(userActivity)
                .build();
    }
}

package com.ssafy.backend.auth.model.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponseDTO {
    private String id;
    private String name;
}

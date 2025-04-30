package com.ssafy.backend.auth.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class LoginRequestDTO {
    @NotBlank(message = "아이디 값은 필수 입니다.")
    private String id;
    @NotBlank(message = "패스워드 값은 필수 입니다.")
    private String password;
}

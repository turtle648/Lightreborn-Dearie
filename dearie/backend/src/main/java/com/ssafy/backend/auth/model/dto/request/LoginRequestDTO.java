package com.ssafy.backend.auth.model.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class LoginRequestDTO {
    @NotBlank(message = "아이디 값은 필수 입니다.")
    @Schema(description = "사용자 ID", example = "test", defaultValue = "test")
    private String id;

    @NotBlank(message = "패스워드 값은 필수 입니다.")
    @Schema(description = "비밀번호", example = "test", defaultValue = "test")
    private String password;
}

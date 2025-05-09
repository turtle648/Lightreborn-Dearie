package com.ssafy.backend.auth.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class SignUpDTO {
    @NotBlank(message = "아이디는 필수입니다.")
    private String id;
    @NotBlank(message = "비밀번호는 필수입니다.")
    private String password;
    @NotBlank(message = "이름은 필수입니다.")
    private String name;
    @NotNull(message = "역할은 필수입니다.")
    private Integer role;
}

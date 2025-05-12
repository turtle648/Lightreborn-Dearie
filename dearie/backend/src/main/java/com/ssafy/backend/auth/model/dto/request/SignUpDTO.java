package com.ssafy.backend.auth.model.dto.request;

import com.ssafy.backend.auth.model.state.Gender;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class SignUpDTO {
    @NotBlank(message = "아이디는 필수입니다.")
    @Schema(description = "사용자 ID", example = "test", defaultValue = "test")
    private String id;

    @NotBlank(message = "비밀번호는 필수입니다.")
    @Schema(description = "비밀번호", example = "test", defaultValue = "test")
    private String password;

    @NotBlank(message = "이름은 필수입니다.")
    @Schema(description = "이름", example = "홍길동", defaultValue = "홍길동")
    private String name;

    @NotBlank(message = "닉네임은 필수입니다.")
    @Schema(description = "닉네임", example = "길동이", defaultValue = "길동이")
    private String nickName;

    @NotBlank(message = "성별은 필수입니다.")
    @Schema(description = "성별 (MALE, FEMALE)", example = "MALE", defaultValue = "MALE")
    private String gender;

    @NotNull(message = "생일은 필수입니다.")
    @Schema(description = "생년월일 (yyyy-MM-dd)", example = "2000-01-01", defaultValue = "2000-01-01")
    private LocalDate birthDate;

    @NotBlank(message = "번호는 필수입니다.")
    @Schema(description = "전화번호", example = "01012345678", defaultValue = "01012345678")
    private String phoneNumber;

    @Schema(description = "비상 연락처", example = "01098765432", defaultValue = "01098765432")
    private String emergencyContact;


    public Gender toGenderEnum () {
        return Gender.from(this.gender);
    }
}

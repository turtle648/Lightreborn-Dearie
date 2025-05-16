package com.ssafy.backend.survey.model.dto.request;

import com.ssafy.backend.auth.model.entity.User;
import com.ssafy.backend.auth.model.state.Gender;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDate;

@Data
@Getter
@Builder
public class UserInfoDTO {
    private String name;
    private String gender;
    private String birthDate;
    private Short age;
    private String phoneNumber;
    private String emergencyContact;

    public static UserInfoDTO from (User user) {
        return UserInfoDTO.builder()
                .name(user.getName())
                .age(user.getAge())
                .birthDate(user.getBirthDate().toString())
                .gender(user.getGender().getLabel())
                .phoneNumber(user.getPhoneNumber())
                .emergencyContact(user.getEmergencyContact())
                .build();
    }
}

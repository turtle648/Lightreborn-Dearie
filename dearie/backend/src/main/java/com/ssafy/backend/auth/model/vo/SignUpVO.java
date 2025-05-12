package com.ssafy.backend.auth.model.vo;

import com.ssafy.backend.auth.exception.AuthErrorCode;
import com.ssafy.backend.auth.exception.AuthException;
import com.ssafy.backend.auth.model.entity.User;
import com.ssafy.backend.auth.model.state.Gender;
import lombok.Getter;

import java.time.LocalDate;
import java.time.Period;

@Getter
public class SignUpVO {
    private final String id;
    private final String password;
    private final String name;
    private final String nickName;
    private final Gender gender;
    private final LocalDate birthDate;
    private final String profileImg = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fkr.pinterest.com%2Fbunnyrabbit4163%2F%25EC%2598%25A4%25EB%25A6%25AC%2F&psig=AOvVaw1-doEzSFVR_JAWPNeFVwTW&ust=1747105140864000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCICnhvz3nI0DFQAAAAAdAAAAABAE";
    private final Short age;
    private final String phoneNumber;
    private final String emergencyContact;

    private SignUpVO(String id, String password, String name, String nickName, Gender gender, LocalDate birthDate,
                     Short age, String phoneNumber, String emergencyContact) {
        this.id = id;
        this.password = password;
        this.name = name;
        this.nickName = nickName;
        this.gender = gender;
        this.birthDate = birthDate;
        this.age = age;
        this.phoneNumber = phoneNumber;
        this.emergencyContact = emergencyContact;
    }

    public static SignUpVO of(String id, String password, String name, String nickName, Gender gender,
                              LocalDate birthDate, String phoneNumber, String emergencyContact) {
        if (id == null || id.isBlank()) throw new AuthException(AuthErrorCode.ID_REQUIRED);
        if (password == null || password.isBlank()) throw new AuthException(AuthErrorCode.PASSWORD_REQUIRED);
        if (name == null || name.isBlank()) throw new AuthException(AuthErrorCode.NAME_REQUIRED);
        if (nickName == null || nickName.isBlank()) throw new AuthException(AuthErrorCode.NICKNAME_REQUIRED);
        if (gender == null) throw new AuthException(AuthErrorCode.GENDER_REQUIRED);
        if (birthDate == null) throw new AuthException(AuthErrorCode.BIRTHDATE_REQUIRED);
        if (phoneNumber == null || phoneNumber.isBlank()) throw new AuthException(AuthErrorCode.PHONE_REQUIRED);

        Short age = Integer.valueOf(Period.between(birthDate, LocalDate.now()).getYears()).shortValue();
        return new SignUpVO(id, password, name, nickName, gender, birthDate, age, phoneNumber, emergencyContact);
    }

    public User toEntity(String encodedPassword) {
        return User.builder()
                .loginId(this.id)
                .password(encodedPassword)
                .name(this.name)
                .nickname(this.nickName)
                .gender(this.gender)
                .birthDate(this.birthDate)
                .age(this.age)
                .profileImg(this.profileImg)
                .phoneNumber(this.phoneNumber)
                .emergencyContact(this.emergencyContact)
                .build();
    }
}

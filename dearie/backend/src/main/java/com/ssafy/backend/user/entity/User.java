package com.ssafy.backend.user.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String loginId;

    @Column(nullable = false)
    private String password;

    @Column(unique = true)
    private Long kakaoId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Gender gender;

    @Column(nullable = false, length = 50)
    private String nickname;

    @Column(nullable = false)
    private Integer age;

    @Column(name = "profile_img", length = 255)
    private String profileImg;

    public enum Gender {
        MALE, FEMALE, OTHER
    }
}
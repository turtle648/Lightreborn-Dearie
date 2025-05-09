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

    @Column(name = "login_id", nullable = false, unique = true, length = 20)
    private String loginId;

    @Column(nullable = false, length = 20)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Gender gender;

    @Column(nullable = false, length = 100)
    private String nickname;

    @Column(name = "profile_img", nullable = false, length = 255)
    private String profileImg;

    @Column(nullable = false)
    private Short age;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "birth_date")
    private java.time.LocalDate birthDate;

    @Column(length = 30)
    private String name;

    @Column(name = "emergency_contact", length = 20)
    private String emergencyContact;

    public enum Gender {
        MALE, FEMALE, OTHER
    }
}

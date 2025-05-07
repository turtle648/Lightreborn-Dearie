package com.ssafy.backend.youth_consultation.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "personal_info")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonalInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50)
    private String name;

    @Column(length = 20)
    private String phoneNumber;

    private LocalDate birthDate;

    @Column(length = 20)
    private String emergencyContact;
}

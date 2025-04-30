package com.ssafy.backend.youth_consultation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "survey_personal_info")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SurveyPersonalInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50)
    private String name;

    @Column(length = 20)
    private String phoneNumber;

    private LocalDateTime brithDate;

    @Column(length = 20)
    private String emergencyContact;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "isolated_youth_id")
    private IsolatedYouth isolatedYouth;
}

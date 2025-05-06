package com.ssafy.backend.youth_consultation.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "isolated_youths")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IsolatedYouth {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 10)
    private String isolationLevel;

    @Column(length = 2)
    private String economicLevel;

    @Column(length = 2)
    private String economicActivityRecent;

    private Integer isolatedScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "process_step")
    private SurveyProcessStep surveyProcessStep;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personal_info")
    private PersonalInfo personalInfo;
}

package com.ssafy.backend.youth_consultation.model.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;

@Slf4j
@ToString
@Entity
@Table(name = "survey_versions")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SurveyVersion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    private Long version = 1L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "personal_info_id")
    private PersonalInfo personalInfo;

    private LocalDate surveyDate;

    @OneToOne(mappedBy = "surveyVersion", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private SurveyScaleScores scaleScores;
}

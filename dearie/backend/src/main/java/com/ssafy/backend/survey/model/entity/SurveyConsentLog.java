package com.ssafy.backend.survey.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "survey_consent_logs")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class SurveyConsentLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Boolean isAgreed;

    @Column(nullable = false)
    private LocalDateTime agreedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_consent_id")
    private SurveyConsent surveyConsent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_id")
    private Survey survey;
}

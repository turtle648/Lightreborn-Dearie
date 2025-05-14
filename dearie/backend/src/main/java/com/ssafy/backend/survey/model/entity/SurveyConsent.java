package com.ssafy.backend.survey.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "survey_consents")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class SurveyConsent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String purpose;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String items;

    @Column(nullable = false)
    private String period;

    @Column(nullable = false)
    private Boolean isRequired;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_template_id")
    private SurveyTemplate surveyTemplate;
}

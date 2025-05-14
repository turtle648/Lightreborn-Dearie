package com.ssafy.backend.survey.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "survey_consents")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurveyConsent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Lob
    @Column(nullable = false)
    private String purpose;

    @Lob
    @Column(nullable = false)
    private String items;

    @Column(nullable = false)
    private String period;

    @Column(nullable = false)
    private Boolean isRequired;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_template_id")
    private SurveyTemplate surveyTemplate;
}

package com.ssafy.backend.youth_consultation.model.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
public class SurveyScaleScores {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int socioeconomicScore;

    private int socialInteractionScore;

    private int lifestyleScore;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="survey_version_id", nullable = false, unique = true)
    private SurveyVersion surveyVersion;

}

package com.ssafy.backend.survey.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "survey_templates")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurveyTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "survey_title", length = 30, nullable = false)
    private String surveyTitle;
}

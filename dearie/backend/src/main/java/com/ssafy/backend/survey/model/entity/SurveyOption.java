package com.ssafy.backend.survey.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "survey_options")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurveyOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "option_text", nullable = false)
    private String optionText;

    private int score;

    private int order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="survey_questions_id", nullable = false)
    private SurveyQuestion surveyQuestion;
}

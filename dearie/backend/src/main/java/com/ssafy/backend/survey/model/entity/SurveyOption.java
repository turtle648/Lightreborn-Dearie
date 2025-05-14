package com.ssafy.backend.survey.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "survey_options")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class SurveyOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "option_text", columnDefinition = "TEXT", nullable = false)
    private String optionText;

    @Column(name = "score", nullable = false)
    private int score;

    @Column(name = "option_num", nullable = false)
    private int optionNum;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="survey_questions_id", nullable = false)
    private SurveyQuestion surveyQuestion;
}

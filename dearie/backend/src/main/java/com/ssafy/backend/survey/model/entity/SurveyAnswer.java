package com.ssafy.backend.survey.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "survey_answers")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurveyAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(name = "answer_text")
    private String answerText;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "answer_choice")
    private SurveyAnswer answerChoice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_questions_id")
    private SurveyQuestion surveyQuestion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_id")
    private Survey survey;
}

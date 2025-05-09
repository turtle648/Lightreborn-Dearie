package com.ssafy.backend.survey.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "survey_answers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurveyAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "answer_test", length = 50)
    private String answerTest;

    @Column(name = "answer_choice")
    private Integer answerChoice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_questions_id")
    private SurveyQuestion surveyQuestion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "counseling_id")
    private CounselingLog counselingLog;
}

package com.ssafy.backend.survey.model.entity;

import com.ssafy.backend.survey.model.state.SurveyType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "survey_questions")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class SurveyQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String content;

    @Column(name = "question_code", length = 10, nullable = false)
    private String questionCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SurveyType surveyType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_templates_id")
    private SurveyTemplate surveyTemplate;
}

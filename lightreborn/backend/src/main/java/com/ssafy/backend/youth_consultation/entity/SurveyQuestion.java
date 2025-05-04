package com.ssafy.backend.youth_consultation.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ToString
@Entity
@Table(name = "survey_questions")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SurveyQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    @Column(length = 10)
    private String questionCode;
}

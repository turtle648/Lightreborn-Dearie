package com.ssafy.backend.diary.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "emotion_score")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class EmotionScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double joy;

    @Column(nullable = false)
    private Double sadness;

    @Column(nullable = false)
    private Double anger;

    @Column(nullable = false)
    private Double anxiety;

    @Column(nullable = false)
    private Double calm;
}
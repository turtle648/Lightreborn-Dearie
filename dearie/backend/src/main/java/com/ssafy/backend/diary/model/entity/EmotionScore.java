package com.ssafy.backend.diary.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "emotion_score")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmotionScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double joy;
    private Double sadness;
    private Double anger;
    private Double anxiety;
    private Double disgust;
    private Double neutral;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diary_id")
    private Diary diary;
}
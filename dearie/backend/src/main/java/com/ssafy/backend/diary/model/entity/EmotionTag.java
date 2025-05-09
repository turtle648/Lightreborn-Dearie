package com.ssafy.backend.diary.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "emotion_tag")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmotionTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tag;  // 예: "우울", "불안"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diary_id")
    private Diary diary;
}

package com.ssafy.backend.diary.model.entity;

import com.ssafy.backend.diary.model.state.EmotionType;
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

    @Column(name = "tag")
    private String tag;  // 12가지 감정 한글로 저장 ("분노", "기쁨" 등)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diary_id")
    private Diary diary;
}

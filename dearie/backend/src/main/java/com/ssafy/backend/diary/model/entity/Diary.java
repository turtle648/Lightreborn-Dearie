package com.ssafy.backend.diary.model.entity;

import com.ssafy.backend.auth.model.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "diary")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Diary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "text")
    private String content;

    private LocalDateTime createdAt;

    @Builder.Default
    private Boolean bookmarked = false;

    @Column(columnDefinition = "text")
    private String aiComment;

    @Enumerated(EnumType.STRING)
    private EmotionTag emotionTag;

    // 연관 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "diary", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DiaryImage> images = new ArrayList<>();

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "sticker_id")
    private Sticker sticker;

    @OneToOne(mappedBy = "diary", cascade = CascadeType.ALL, orphanRemoval = true)
    private EmotionScore emotionScore;

    public enum EmotionTag {
        JOY,        // 😊 기쁨
        SADNESS,    // 😢 슬픔
        ANGER,      // 😠 화남
        ANXIETY,    // 😰 불안
        NEUTRAL,    // 😌 평온
        BOREDOM,    // 😑 지루함
        EXCITEMENT, // 😍 설렘
        GRATITUDE,  // 🙏 감사
        SURPRISE,   // 😲 놀람
        CONFUSION,  // 😵 혼란
        HOPE,       // 🌈 희망
        FATIGUE     // 😴 피곤
    }
}


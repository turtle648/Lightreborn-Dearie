package com.ssafy.backend.youth_consultation.model.entity;

import com.ssafy.backend.auth.model.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "counseling_log")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CounselingLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime consultationDate;
    private String voiceFileUrl;
    private String fullScript;
    private String summarize;
    private String counselorKeyword;
    private String clientKeyword;
    private String memoKeyword;

    @Enumerated(EnumType.STRING)
    @Column(name = "process_step")
    private CounselingProcess counselingProcess;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "isolated_youth_id")
    private IsolatedYouth isolatedYouth;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @PrePersist
    protected void onCreate() {
        if (this.consultationDate == null) {
            this.consultationDate = LocalDateTime.now();
        }
    }
}
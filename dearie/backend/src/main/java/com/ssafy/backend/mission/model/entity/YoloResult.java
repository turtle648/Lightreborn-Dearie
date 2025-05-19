package com.ssafy.backend.mission.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "yolo_results")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
public class YoloResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_keyword", nullable = false, length = 10)
    private String imageKeyword;

    @Column(name = "image_url", nullable = false, length = 100)
    private String imageUrl;

    @Column(name = "path_file_url", length = 255)
    private String pathFileUrl;

    @Column(name = "created_at", nullable = false, updatable = false,
            columnDefinition = "TIMESTAMP DEFAULT NOW()")
    private LocalDateTime createdAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mission_result_id", unique = true)
    private MissionResult missionResult;

    @PrePersist
    private void prePersist() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
    }

    public static YoloResult of(MissionResult mr, String keyword, String imageUrl, String pathFileUrl) {
        return YoloResult.builder()
                .missionResult(mr)
                .imageKeyword(keyword)
                .imageUrl(imageUrl)
                .pathFileUrl(pathFileUrl)
                .build();
    }
}

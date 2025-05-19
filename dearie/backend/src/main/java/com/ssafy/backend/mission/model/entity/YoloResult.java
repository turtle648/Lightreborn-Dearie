package com.ssafy.backend.mission.model.entity;

import jakarta.persistence.*;
import lombok.*;

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

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mission_result_id", unique = true)
    private MissionResult missionResult;

    public static YoloResult of(MissionResult mr, String keyword, String imageUrl) {
        return YoloResult.builder()
                .missionResult(mr)
                .imageKeyword(keyword)
                .imageUrl(imageUrl)
                .build();
    }
}

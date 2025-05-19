package com.ssafy.backend.mission.model.entity;

import com.ssafy.backend.mission.model.enums.MissionExecutionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "missions")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mission_type_id")
    private MissionType missionType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MissionExecutionType missionExecutionType;  // WALK, IMAGE, TEXT, MUSIC 등

    @Column(length = 100)
    private String requiredObjectLabel;

    @Column(length = 50, nullable = false)
    private String missionTitle;
}

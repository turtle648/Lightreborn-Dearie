package com.ssafy.backend.mission.model.entity;

import com.ssafy.backend.mission.model.enums.MissionTypeMapping;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mission_types")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MissionType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private MissionTypeMapping type;
}

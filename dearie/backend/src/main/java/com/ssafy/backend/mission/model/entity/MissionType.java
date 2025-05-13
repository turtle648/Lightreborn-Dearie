package com.ssafy.backend.mission.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "mission_type")
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
    private Type type;

    public enum Type {
        ACTIVE, STATIC
    }
}

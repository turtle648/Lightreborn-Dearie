package com.ssafy.backend.youth_consultation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "isolated_youths")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IsolatedYouth {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 10)
    private String name;

    @Column(length = 2)
    private String sex;

    private Integer age;

    @Column(length = 10)
    private String isolationLevel;

    @Column(length = 2)
    private String economicLevel;

    @Column(length = 2)
    private String economicActivityRecent;

    private Integer isolatedScore;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "process_step")
    private ProcessStep processStep;
}

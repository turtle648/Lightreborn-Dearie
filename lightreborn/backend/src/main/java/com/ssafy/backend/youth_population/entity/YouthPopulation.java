package com.ssafy.backend.youth_population.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.util.Date;

@Entity
@Table(name = "youth_populations")
@Getter
public class YouthPopulation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer youthHouseholdCount;
    private Integer youthMaleHouseholdCount;
    private Integer youthFemaleHouseholdCount;
    private Integer youthPopulation;
    private Integer youthMalePopulation;
    private Integer youthFemalePopulation;
    private Date base_date;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="hangjung_id")
    Hangjungs hangjungs;

}

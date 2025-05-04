package com.ssafy.backend.youth_population.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.AccessLevel;

import java.time.LocalDate;

@Entity
@Table(name = "youth_populations")
@Builder(toBuilder = true)
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE) // builder 전용 생성자
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA용 기본 생성자
@JsonIgnoreProperties("hangjungs")   // → convertValue 시 hangjungs는 무시: 연관 관계를 가지는 필드라
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
    private LocalDate baseDate;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="hangjung_id")
    Hangjungs hangjungs;

    public void assignHangjungs(Hangjungs hangjungs) {
        this.hangjungs = hangjungs;
    }

}

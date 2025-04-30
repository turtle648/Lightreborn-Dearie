package com.ssafy.backend.dashboard.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDate;

@Entity
@Table(name = "promotion_status")
@Getter
public class PromotionStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String address;

    private Float latitude;

    private Float longitude;

    private Boolean isCurrent;

    private LocalDate createdAt;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "hangjung_id")
    private Hangjungs hangjung;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name= "promotion_type_id")
    private PromotionType promotionType;
}

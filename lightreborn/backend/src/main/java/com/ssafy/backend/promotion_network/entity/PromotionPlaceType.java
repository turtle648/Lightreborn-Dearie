package com.ssafy.backend.promotion_network.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table(name = "promotion_place_type")
@Getter
public class PromotionPlaceType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String place_type;
}

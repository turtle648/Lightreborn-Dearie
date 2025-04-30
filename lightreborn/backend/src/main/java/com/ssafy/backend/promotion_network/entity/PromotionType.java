package com.ssafy.backend.promotion_network.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table(name = "promotion_types")
@Getter
public class PromotionType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
}

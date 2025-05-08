package com.ssafy.backend.promotion_network.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table(name = "promotion_information")
@Getter
public class PromotionInformation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;
}

package com.ssafy.backend.promotion_network.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "promotion_types")
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE) // builder 전용 생성자
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA용 기본 생성자
public class PromotionType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
}

package com.ssafy.backend.report.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "welfare_center")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class WelfareCenter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 주소
    @Column(nullable = false, length = 255)
    private String address;

    // 위도/경도
    @Column(nullable = false, precision = 9)
    private Double latitude;

    @Column(nullable = false, precision = 9)
    private Double longitude;

    // 기관명
    @Column(nullable = false, length = 100)
    private String name;

    // 유형 (예: “심리상담”, “긴급지원” 등)
    @Column(length = 50)
    private String type;

    // 전화번호
    @Column(length = 100)
    private String phoneNumber;
}

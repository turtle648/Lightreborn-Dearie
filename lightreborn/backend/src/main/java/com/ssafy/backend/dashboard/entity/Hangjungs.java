package com.ssafy.backend.dashboard.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table(name = "hangjungs")
@Getter
public class Hangjungs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer hangjungCode;

    private String hangjungName;
}

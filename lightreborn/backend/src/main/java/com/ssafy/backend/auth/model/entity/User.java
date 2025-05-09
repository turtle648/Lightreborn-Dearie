package com.ssafy.backend.auth.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "login_id", nullable = false, length = 20, unique = true)
    private String userId;

    private String name;

    @Column(name = "password", nullable = false)
    @JsonIgnore
    private String password;

    @Column(nullable = false)
    private int role = 0; // 사용자 0, 관리자 1
}
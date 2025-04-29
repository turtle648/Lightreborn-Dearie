package com.ssafy.backend.auth.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String nickName;
    private String gender;
    private String age;
    @Column(nullable = false, columnDefinition = "int default 0")
    private int role; // 사용자 0, 매장 관리자 1, 차단된 사용자 2

}
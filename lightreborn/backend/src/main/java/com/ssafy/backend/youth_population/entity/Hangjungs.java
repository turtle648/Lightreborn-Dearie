package com.ssafy.backend.youth_population.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 양산시 행정 데이터를 저장하는 엔티티입니다.
 * <p>
 * 이 테이블은 초기 데이터가 한 번 삽입된 이후에는 거의 수정되지 않으며,
 * 조회가 빈번하기 때문에 조회 성능 향상을 위해 복합 인덱스(hangjugCode, hangjungName)을 추가했습니다.
 * 단, 복합 인덱스는 "hangjungCode -> hangjungName" 순서로 생성됐기 때문에
 * hangjungName 단독 검색 시에는 인덱스가 사용되지 않습니다.
 * */
@Entity
@Table(name = "hangjungs",
        indexes = { @Index(name ="idx_hangjung_code_name", columnList ="hangjungCode, hangjungName")})
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE) // builder 전용 생성자
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA용 기본 생성자
public class Hangjungs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String hangjungCode;

    private String hangjungName;
}

package com.ssafy.backend.youth_consultation.entity;

import com.ssafy.backend.youth_population.entity.Hangjungs;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "counseling_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CounselingLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String welfareCenterAddress;

    private LocalDateTime consultation_date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "isolated_youth_id")
    private IsolatedYouth isolatedYouth;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hangjund_id")
    private Hangjungs hangjungs;
}
package com.ssafy.backend.welfare_center.entity;

import com.ssafy.backend.youth_population.entity.Hangjungs;
import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table(name = "partner_organizations")
@Getter
public class PartnerOrganization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String address;

    private String type;

    private String phoneNumber;

    private Float latitude;

    private Float longitude;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="hangjung_id")
    private Hangjungs hangjung;
}

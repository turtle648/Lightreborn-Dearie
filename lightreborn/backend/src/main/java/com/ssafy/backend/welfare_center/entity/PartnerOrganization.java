package com.ssafy.backend.welfare_center.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ssafy.backend.youth_population.entity.Hangjungs;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "partner_organizations")
@Getter
@Builder(toBuilder = true)
@AllArgsConstructor(access = AccessLevel.PRIVATE) // builder 전용 생성자
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA용 기본 생성자
@JsonIgnoreProperties("hangjungs")
public class PartnerOrganization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String organizationName;

    private String address;

    private String type;

    private String phoneNumber;

    private Double latitude;

    private Double longitude;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="hangjung_id")
    private Hangjungs hangjungs;

    public void assignHangjungs(Hangjungs hangjungs) {
        this.hangjungs = hangjungs;
    }
}

package com.ssafy.backend.promotion_network.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ssafy.backend.youth_population.entity.Hangjungs;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.AccessLevel;

import java.time.LocalDate;

@Entity
@Table(name = "promotion_status")
@Getter
@Builder(toBuilder = true)
@AllArgsConstructor(access = AccessLevel.PRIVATE) // builder 전용 생성자
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA용 기본 생성자
@JsonIgnoreProperties({"hangjungs", "promotionType", "promotionInformation", "promotionPlaceType"})
public class PromotionStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String address;

    private Double latitude;

    private Double longitude;

    private Boolean isPublished;

    private LocalDate createdAt;

    private String promotionSpotName;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name = "hangjung_id")
    private Hangjungs hangjungs;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name= "promotion_type_id")
    private PromotionType promotionType;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name= "promotion_information_id")
    private PromotionInformation promotionInformation;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name= "promotion_place_type")
    private PromotionPlaceType promotionPlaceType;

    public void assignHangjungs(Hangjungs hangjungs) {
        this.hangjungs = hangjungs;
    }

    public void assignPromotionType(PromotionType promotionType) {
        this.promotionType = promotionType;
    }

    public void assignPromotionInformation(PromotionInformation promotionInformation) {
        this.promotionInformation = promotionInformation;
    }

    public void assignPromotionPlaceType(PromotionPlaceType promotionPlaceType) {
        this.promotionPlaceType = promotionPlaceType;
    }
}

package com.ssafy.backend.promotion_network.repository;

import com.ssafy.backend.promotion_network.entity.PromotionPlaceType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PromotionPlaceTypeRepository extends JpaRepository<PromotionPlaceType, Long> {

    Optional<PromotionPlaceType> findByPlaceType(String promotionPlaceTypeName);
}

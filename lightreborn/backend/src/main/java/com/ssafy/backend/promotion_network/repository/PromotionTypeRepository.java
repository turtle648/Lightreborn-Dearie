package com.ssafy.backend.promotion_network.repository;

import com.ssafy.backend.promotion_network.entity.PromotionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PromotionTypeRepository extends JpaRepository<PromotionType, Long> {

    Optional<PromotionType> findByType(String type);
}

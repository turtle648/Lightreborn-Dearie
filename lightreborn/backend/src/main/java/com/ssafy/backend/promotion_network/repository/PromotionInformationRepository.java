package com.ssafy.backend.promotion_network.repository;

import com.ssafy.backend.promotion_network.entity.PromotionInformation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PromotionInformationRepository extends JpaRepository<PromotionInformation, Long> {

    Optional<PromotionInformation> findByContent(String content);
}

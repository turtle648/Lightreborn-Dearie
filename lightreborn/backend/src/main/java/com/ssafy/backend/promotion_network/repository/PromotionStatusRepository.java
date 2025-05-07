package com.ssafy.backend.promotion_network.repository;

import com.ssafy.backend.promotion_network.entity.PromotionStatus;
import com.ssafy.backend.promotion_network.model.response.PromotionResponseDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Repository
public interface PromotionStatusRepository extends JpaRepository<PromotionStatus, Long> {

    boolean existsByAddressAndCreatedAt(String address, LocalDate createdAt);

    List<PromotionStatus> findAllByAddressIn(Set<String> address);

    List<PromotionStatus> findByHangjungsId(Long hangjungsId);

}

package com.ssafy.backend.welfare_center.repository;

import com.ssafy.backend.welfare_center.entity.PartnerOrganization;
import com.ssafy.backend.welfare_center.model.response.WelfareCenterDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface WelfareCenterRepository extends JpaRepository<PartnerOrganization, Long>
        , JpaSpecificationExecutor<PartnerOrganization> {

    // 행정동 코드로 기관 조회
    List<PartnerOrganization> findByHangjungsId(Long hangjungId);

    // 행정동 코드로 기관 개수 조회
    long countByHangjungsId(Long hangjungId);

}

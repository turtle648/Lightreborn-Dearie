package com.ssafy.backend.welfare_center.repository;

import com.ssafy.backend.welfare_center.entity.PartnerOrganization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface WelfareCenterRepository extends JpaRepository<PartnerOrganization, Long>
        , JpaSpecificationExecutor<PartnerOrganization> {

}

package com.ssafy.backend.youth_consultation.repository;

import com.ssafy.backend.youth_consultation.entity.PersonalInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonalInfoRepository extends JpaRepository<PersonalInfo, Long> {
}

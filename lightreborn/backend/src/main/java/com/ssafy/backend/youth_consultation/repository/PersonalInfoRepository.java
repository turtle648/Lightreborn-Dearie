package com.ssafy.backend.youth_consultation.repository;

import com.ssafy.backend.youth_consultation.model.entity.PersonalInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PersonalInfoRepository extends JpaRepository<PersonalInfo, Long> {
    Optional<PersonalInfo> findByNameAndPhoneNumber(String name, String phoneNumber);
}

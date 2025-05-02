package com.ssafy.backend.youth_consultation.repository;

import com.ssafy.backend.youth_consultation.entity.IsolatedYouth;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IsolatedYouthRepository extends JpaRepository<IsolatedYouth, Long> {
    Optional<IsolatedYouth> findById(Long Id);
}

package com.ssafy.backend.youth_population.repository;

import com.ssafy.backend.youth_population.entity.Hangjungs;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HangjungsRepository extends JpaRepository<Hangjungs, Long> {
    Optional<Hangjungs> findByHangjungCode(String hangjungCode);
}

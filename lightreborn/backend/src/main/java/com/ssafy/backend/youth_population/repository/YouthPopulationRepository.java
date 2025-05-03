package com.ssafy.backend.youth_population.repository;

import com.ssafy.backend.youth_population.entity.YouthPopulation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface YouthPopulationRepository extends JpaRepository<YouthPopulation, Long> {

    /**
     * hangjungsId로 값이 이미 존재하는지 확인
     * */
    boolean existsByHangjungs_Id(Long hangjungsId);
}

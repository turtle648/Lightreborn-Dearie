package com.ssafy.backend.youth_population.repository;

import com.ssafy.backend.youth_population.entity.Hangjungs;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface HangjungsRepository extends JpaRepository<Hangjungs, Long> {
    
    /**
     * hanjungCode로 행정 찾기
     * */
    Optional<Hangjungs> findByHangjungCode(String hangjungCode);

    @Query("SELECT h.id FROM Hangjungs h WHERE h.hangjungCode = :hangjungCode")
    Long findHangjungsIdByHangjungCode(@Param("code") String hangjungCode);
}

package com.ssafy.backend.youth_population.repository;

import com.ssafy.backend.youth_population.entity.YouthPopulation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface YouthPopulationRepository extends JpaRepository<YouthPopulation, Long>,
        JpaSpecificationExecutor<YouthPopulation> {

    /**
     * hangjungsId로 값이 이미 존재하는지 확인
     * */
    //boolean existsByHangjungs_Id(Long hangjungsId);

    /*
    * hangjungCode로 가장 최신 1인 가구 비율과 1인 가구 성비 찾기
    * */
    @Query("SELECT yp FROM YouthPopulation yp JOIN FETCH yp.hangjungs h WHERE h.hangjungCode = :dongCode ORDER BY yp.baseDate DESC LIMIT 1")
    Optional<YouthPopulation> findLatestByHangjungCode(@Param("dongCode") Long dongCode);

    /*
     * 양산시 전체 청년 인구 수
     * */
    @Query("SELECT SUM(yp.youthPopulation) FROM YouthPopulation yp")
    int sumAllYouthPopulation();

    /*
    * 각 행정동의 가장 최신 baseDate를 가진 YouthPopulation 조회
    * */
    @Query("""
    SELECT yp FROM YouthPopulation yp
    JOIN FETCH yp.hangjungs h
    WHERE yp.baseDate = (
        SELECT MAX(y.baseDate)
        FROM YouthPopulation y
        WHERE y.hangjungs.hangjungCode = h.hangjungCode
    )
    """)
    List<YouthPopulation> findLatestYouthPopulations();
}

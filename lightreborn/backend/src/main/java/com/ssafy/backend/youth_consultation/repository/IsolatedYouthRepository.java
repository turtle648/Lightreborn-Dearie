package com.ssafy.backend.youth_consultation.repository;

import com.ssafy.backend.youth_consultation.model.entity.IsolatedYouth;
import com.ssafy.backend.youth_consultation.model.entity.SurveyProcessStep;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IsolatedYouthRepository extends JpaRepository<IsolatedYouth, Long> {

    Optional<IsolatedYouth> findById(Long Id);

    /**
     * 고립청년 분류별 인원 수를 조회한다.
     *
     * @return 분류명(category)과 해당 인원 수(count)를 담은 리스트
     */
    @Query("SELECT i.isolationLevel AS category, COUNT(i) AS count "
    + "FROM IsolatedYouth i "
    + "GROUP BY i.isolationLevel")
    List<CategoryCount> countByIsolationLevel();

    interface CategoryCount {
        String getCategory();
        Long getCount();
    }

    /**
     * 특정 연도의 상담 건수를 월별로 집계하여 반환한다.
     *
     * @param year 조회할 연도 (예: 2025)
     * @return [월, 상담 건수] 쌍의 리스트 (1~12월 중 존재하는 월만 포함)
     */
    @Query(value = """
        SELECT EXTRACT(MONTH FROM consultation_date) AS month, COUNT(*) AS count
        FROM counseling_log
        WHERE EXTRACT(YEAR FROM consultation_date) = :year
        GROUP BY EXTRACT(MONTH FROM consultation_date)
        ORDER BY EXTRACT(MONTH FROM consultation_date)
    """, nativeQuery = true)
    List<Object[]> countMonthByYear(@Param("year") int year);


    /**
     * 최근 3개월 간의 월별 신규 상담 등록자 수를 조회한다.
     *
     * @return 최근 3개월의 [월, 등록자 수] 쌍 리스트
     */
    @Query(value = """
    SELECT EXTRACT(MONTH FROM consultation_date)::int AS month,
        COUNT(*) AS count
        FROM counseling_log
        WHERE consultation_date >= :cutoffDate
        GROUP BY month
        ORDER BY month        
    """, nativeQuery = true)
    List<MonthCount> countRecentRegistrations(@Param("cutoffDate") LocalDate cutoffDate);

    interface MonthCount {
        Integer getMonth();
        Long getCount();
    }


    Page<IsolatedYouth> findBySurveyProcessStep(SurveyProcessStep surveyProcessStep, Pageable pageable);
    @Query("""
        SELECT i FROM IsolatedYouth i
        WHERE i.surveyProcessStep = :step
        AND i.personalInfo.name LIKE %:name%
    """)
    Page<IsolatedYouth> findBySurveyProcessStepAndName(
            @Param("step") SurveyProcessStep step,
            @Param("name") String name,
            Pageable pageable
    );

    /**
     * personalInfo를 미리 패치해서 N+1 문제 방지
     */
    @EntityGraph(attributePaths = "personalInfo")
    @Override
    Page<IsolatedYouth> findAll(Pageable pageable);

    @EntityGraph(attributePaths = "personalInfo")
    Optional<IsolatedYouth> findByPersonalInfoId(Long personalInfoId);
}

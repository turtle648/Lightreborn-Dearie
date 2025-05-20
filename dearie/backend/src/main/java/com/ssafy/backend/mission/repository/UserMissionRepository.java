package com.ssafy.backend.mission.repository;

import com.ssafy.backend.mission.model.entity.UserMission;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface UserMissionRepository extends JpaRepository<UserMission, Long> {
    /**
     * date 컬럼이 threshold 이전(<=) 이면서 isCompleted = false 인 엔티티 모두 삭제
     */
    void deleteByDateBeforeAndIsCompletedFalse(LocalDate threshold);

    /*
    * 오늘자(userId, date) 할당된 미션만 가져오기
    * */
    List<UserMission> findByUser_IdAndDate(Long userId, LocalDate date);

    /*
    * 최근 미션 중 성공한 미션만 조회하기
    * */
    List<UserMission> findByUser_IdAndIsCompletedTrue(Long userId, Pageable pageable);

    Integer countByUserIdAndIsCompletedTrue(Long userId);
}

package com.ssafy.backend.mission.repository;

import com.ssafy.backend.mission.model.entity.MissionResult;
import com.ssafy.backend.mission.model.enums.MissionResultType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MissionResultRepository extends JpaRepository<MissionResult, Long> {
    /**
     * 특정 UserMission 에서 WALK 타입 MissionResult 한 건을 꺼내오는 메서드
     */
    Optional<MissionResult> findTopByUserMissionIdAndResultType(
            Long userMissionId,
            MissionResultType resultType
    );

    /*
    * 특정 유저의 완료한 미션 최신 순 조회
    * */
    Optional<MissionResult> findTopByUserMissionIdOrderByCreatedAtDesc(Long userMissionId);
}

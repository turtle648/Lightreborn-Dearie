package com.ssafy.backend.mission.repository;

import com.ssafy.backend.mission.model.entity.MissionResult;
import com.ssafy.backend.mission.model.enums.MissionExecutionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MissionResultRepository extends JpaRepository<MissionResult, Long> {
    /*
    * 특정 유저의 완료한 미션 최신 순 조회
    * */
    Optional<MissionResult> findTopByUserMissionIdOrderByCreatedAtDesc(Long userMissionId);

    /**
     * 특정 유저가 완료한 미션 조회
     * */
    Optional<MissionResult> findByUserMission_IdAndUserMission_Mission_MissionExecutionType(Long userMissionId, MissionExecutionType missionExecutionType);
}

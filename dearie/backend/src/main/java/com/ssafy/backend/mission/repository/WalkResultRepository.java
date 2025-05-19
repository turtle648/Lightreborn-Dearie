package com.ssafy.backend.mission.repository;

import com.ssafy.backend.mission.model.entity.MissionResult;
import com.ssafy.backend.mission.model.entity.WalkResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

public interface WalkResultRepository extends JpaRepository<WalkResult, Long> {

    Optional<WalkResult> findByMissionResult(MissionResult result);
}

package com.ssafy.backend.mission.repository;

import com.ssafy.backend.mission.model.entity.MissionResult;
import com.ssafy.backend.mission.model.entity.YoloResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface YoloResultRepository extends JpaRepository<YoloResult, Long> {

    Optional<YoloResult> findByMissionResult(MissionResult result);
}
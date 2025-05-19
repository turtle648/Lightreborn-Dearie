package com.ssafy.backend.mission.repository;

import com.ssafy.backend.mission.model.entity.MissionResult;
import com.ssafy.backend.mission.model.entity.TextResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TextResultRepository extends JpaRepository<TextResult, Long> {

    Optional<TextResult> findByMissionResult(MissionResult result);
}
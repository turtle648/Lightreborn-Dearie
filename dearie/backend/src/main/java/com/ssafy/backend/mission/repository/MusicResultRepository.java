package com.ssafy.backend.mission.repository;

import com.ssafy.backend.mission.model.entity.MissionResult;
import com.ssafy.backend.mission.model.entity.MusicResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MusicResultRepository extends JpaRepository<MusicResult, Long> {

    Optional<MusicResult> findByMissionResult(MissionResult result);
}

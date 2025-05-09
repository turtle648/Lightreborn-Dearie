package com.ssafy.backend.mission.repository;

import com.ssafy.backend.mission.model.entity.Mission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface MissionRepository extends JpaRepository<Mission, Long> {



}

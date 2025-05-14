package com.ssafy.backend.mission.repository;

import com.ssafy.backend.mission.model.entity.Mission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface MissionRepository extends JpaRepository<Mission, Long> {

    @Query(value =
    "SELECT * from missions ORDER BY RANDOM() LIMIT 5", nativeQuery = true)
    List<Mission> findRandomMissions();



}

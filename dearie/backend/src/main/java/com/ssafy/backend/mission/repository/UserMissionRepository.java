package com.ssafy.backend.mission.repository;

import com.ssafy.backend.mission.model.entity.UserMission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserMissionRepository extends JpaRepository<UserMission, Long> {
}

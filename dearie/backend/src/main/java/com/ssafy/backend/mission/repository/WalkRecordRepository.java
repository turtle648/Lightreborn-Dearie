package com.ssafy.backend.mission.repository;

import com.ssafy.backend.mission.model.entity.WalkRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WalkRecordRepository extends JpaRepository<WalkRecord, Long> {


}

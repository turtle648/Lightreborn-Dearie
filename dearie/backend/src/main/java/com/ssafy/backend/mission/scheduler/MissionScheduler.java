package com.ssafy.backend.mission.scheduler;

import com.ssafy.backend.mission.service.MissionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MissionScheduler {
    private final MissionService missionService;

    /*
    * 매일 자정(00:00)에 전체 사용자에게
    * 랜덤 5개 미션 부여
    * */
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void assignDailyMissions() {
        missionService.assignDailyMissionsToAllUsers();
    }

    /*
    * 매일 00:05에, 5일 전 이전의 미완료 미션 삭제
    * */
    @Scheduled(cron = "0 5 0 * * *")
    @Transactional
    public void cleanupStaleUserMissions() {
        missionService.deleteStableUserMissions();
    }
}

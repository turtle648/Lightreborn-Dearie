package com.ssafy.backend.mission.service;

import com.ssafy.backend.mission.model.entity.WalkResult;

public interface WalkResultService {
    // 산책 기록 저장
    WalkResult save(WalkResult walkResult);
}
package com.ssafy.backend.youth_consultation.model.entity;

import lombok.Getter;

@Getter
public enum CounselingProcess {
    IN_PROGRESS, // 진행중
    COMPLETED, // 완료
    NOT_WRITTEN // 미작성
}

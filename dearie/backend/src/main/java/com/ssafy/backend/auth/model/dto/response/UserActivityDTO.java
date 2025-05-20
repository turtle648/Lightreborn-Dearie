package com.ssafy.backend.auth.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserActivityDTO {
    private Integer diaryCount;
    private Integer completeMissionCount;
    private Integer consecutiveCount;

    public static UserActivityDTO from (Integer diaryCount, Integer completeMissionCount, Integer consecutiveCount) {
        return new UserActivityDTO(diaryCount, completeMissionCount, consecutiveCount);
    }
}

package com.ssafy.backend.survey.model.state;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum SurveyResultAnalysis {
    DANGER("고립/은둔",
            "고립/은둔 척도는 사회적 관계와 활동 참여 정도를 측정합니다. 귀하의 결과는 '고립' 단계로 분류됩니다.",
            "사회적 관계가 상당히 제한되어 있습니다. 전문가의 상담을 받아보시고, 점진적으로 사회 활동을 늘려보세요."),

    NORMAL("정상",
            "현재 사회적 관계와 활동 참여가 정상 범위에 있습니다. 앞으로도 활발한 사회적 교류를 지속해 나가시길 바랍니다.",
            "사회적 고립의 위험은 낮은 편입니다. 현재 상태를 유지하면서 필요 시 주변의 도움을 적절히 활용해보세요.");

    private static final int DANGER_THRESHOLD = 20;

    private final String label;       // 상태명
    private final String analysis;    // 해석 문구
    private final String recommend;   // 권장 문구

    public static SurveyResultAnalysis getAnalysis(int totalScore) {
        if (totalScore >= DANGER_THRESHOLD) return DANGER;
        return NORMAL;
    }
}

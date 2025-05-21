package com.ssafy.backend.youth_consultation.model.state;

import com.ssafy.backend.youth_consultation.model.entity.IsolationLevel;
import com.ssafy.backend.youth_consultation.model.entity.SurveyProcessStep;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ProcessStep {
    SELF_DIAGNOSIS,          // 온라인 자가척도 작성
    COUNSELING,              // 은둔고립청년 상담 진행
    INTERNAL_REVIEW,         // 내부 회의 진행
    NON_RISK,       // 비위험군
    AT_RISK;        // 고립 위험군

    public static String getProcessStepName (SurveyProcessStep surveyProcessStep, IsolationLevel level) {
        if (surveyProcessStep.equals(SurveyProcessStep.FINAL_SELECTION)) {
            return level == null ? "" : level.name();
        }

        return ProcessStep.valueOf(surveyProcessStep.name()).name();
    }

    public static SurveyProcessStep from (String type) {
        if(type.equals(AT_RISK.name()) || type.equals(NON_RISK.name())) {
            return SurveyProcessStep.FINAL_SELECTION;
        }

        return SurveyProcessStep.valueOf(type);
    }
}

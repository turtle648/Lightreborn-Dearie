package com.ssafy.backend.youth_consultation.model.vo;

import com.ssafy.backend.youth_consultation.exception.YouthConsultationErrorCode;
import com.ssafy.backend.youth_consultation.exception.YouthConsultationException;
import com.ssafy.backend.youth_consultation.model.entity.IsolatedYouth;
import com.ssafy.backend.youth_consultation.model.entity.IsolationLevel;
import com.ssafy.backend.youth_consultation.model.entity.PersonalInfo;
import com.ssafy.backend.youth_consultation.model.entity.SurveyProcessStep;
import com.ssafy.backend.youth_consultation.model.state.ProcessStep;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class IsolationYouthVO {
    private Long id;
    private IsolationLevel isolationLevel;
    private String economicLevel;
    private String economicActivityRecent;
    private Integer isolatedScore;
    private SurveyProcessStep surveyProcessStep;
    private PersonalInfo personalInfo;

    public static IsolationYouthVO of(IsolatedYouth youth, String processStep) {
        try {
            SurveyProcessStep step = ProcessStep.from(processStep);

            IsolationLevel level = null;
            if (step == SurveyProcessStep.FINAL_SELECTION) {
                level = IsolationLevel.valueOf(processStep);
            } else {
                level = null;
            }

            return new IsolationYouthVO(
                    youth.getId(),
                    level,
                    youth.getEconomicLevel(),
                    youth.getEconomicActivityRecent(),
                    youth.getIsolatedScore(),
                    step,
                    youth.getPersonalInfo()
            );
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new YouthConsultationException(YouthConsultationErrorCode.INVALID_PROCESS_STEP);
        }
    }

    public static IsolatedYouth toEntity (IsolationYouthVO isolationYouthVO) {
        return IsolatedYouth.builder()
                .id(isolationYouthVO.getId())
                .isolationLevel(isolationYouthVO.isolationLevel)
                .economicLevel(isolationYouthVO.getEconomicLevel())
                .economicActivityRecent(isolationYouthVO.getEconomicActivityRecent())
                .isolatedScore(isolationYouthVO.getIsolatedScore())
                .surveyProcessStep(isolationYouthVO.surveyProcessStep)
                .personalInfo(isolationYouthVO.getPersonalInfo())
                .build();
    }
}

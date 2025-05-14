package com.ssafy.backend.survey.model.vo;

import com.ssafy.backend.auth.model.entity.User;
import com.ssafy.backend.survey.model.entity.Survey;
import com.ssafy.backend.survey.model.entity.SurveyTemplate;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class SurveyVO {
    private final Long id;
    private final LocalDateTime createdAt;
    private final String surveyResult;
    private final Boolean isSend;
    private final User user;
    private final SurveyTemplate surveyTemplate;

    private SurveyVO(Long id, LocalDateTime createdAt, String surveyResult, Boolean isSend, User user,
                     SurveyTemplate surveyTemplate) {
        this.id = id;
        this.createdAt = createdAt;
        this.surveyResult = surveyResult;
        this.isSend = isSend;
        this.user = user;
        this.surveyTemplate = surveyTemplate;
    }

    public static SurveyVO of (String surveyResult, User user, SurveyTemplate surveyTemplate) {
        LocalDateTime today = LocalDateTime.now();
        Boolean isSend = false;

        return new SurveyVO(null, today, surveyResult, isSend, user, surveyTemplate);
    }

    public static Survey toEntity (SurveyVO vo) {
        return Survey.builder()
                .id(vo.id)
                .user(vo.user)
                .createdAt(vo.createdAt)
                .isSend(vo.isSend)
                .surveyResult(vo.surveyResult)
                .surveyTemplate(vo.surveyTemplate)
                .build();
    }
}

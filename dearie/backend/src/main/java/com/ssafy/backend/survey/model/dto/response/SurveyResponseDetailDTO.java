package com.ssafy.backend.survey.model.dto.response;

import com.ssafy.backend.mission.model.dto.response.DailyMissionResponseDTO;
import com.ssafy.backend.mission.model.dto.response.MissionResponseDTO;
import com.ssafy.backend.survey.model.entity.Survey;
import com.ssafy.backend.survey.model.state.SurveyResultAnalysis;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class SurveyResponseDetailDTO {
    // 전체 점수
    private Integer totalScore;
    // 사용자의 점수
    private Integer resultScore;
    // 현재 범위
    private String label;
    // 결과 해석
    private String analysis;
    // 권장 문구
    private String recommend;
    // 추천 활동
    private List<MissionResponseDTO> missions;


    public static SurveyResponseDetailDTO from (Integer totalScore, Survey survey, SurveyResultAnalysis analysis,
                                                List<MissionResponseDTO> missions) {
        return SurveyResponseDetailDTO.builder()
                .totalScore(totalScore)
                .resultScore(survey.getSurveyResult())
                .label(analysis.getLabel())
                .analysis(analysis.getAnalysis())
                .recommend(analysis.getRecommend())
                .missions(missions)
                .build();
    }
}

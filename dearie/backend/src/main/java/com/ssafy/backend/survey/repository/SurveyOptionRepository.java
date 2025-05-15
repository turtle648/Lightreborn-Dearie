package com.ssafy.backend.survey.repository;

import com.ssafy.backend.survey.model.entity.SurveyOption;
import com.ssafy.backend.survey.model.entity.SurveyQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SurveyOptionRepository extends JpaRepository<SurveyOption, Long> {
    List<SurveyOption> findAllBySurveyQuestionOrderByOptionNumAsc(SurveyQuestion surveyQuestion);
    List<SurveyOption> findAllBySurveyQuestionInOrderBySurveyQuestionIdAscOptionNumAsc(List<SurveyQuestion> surveyQuestions);

    @Query("""
        SELECT o
        FROM SurveyOption o
        WHERE o.score = (
            SELECT MAX(innerO.score)
            FROM SurveyOption innerO
            WHERE innerO.surveyQuestion = o.surveyQuestion
        )
        AND o.surveyQuestion IN :surveyQuestions
    """)
    List<SurveyOption> findTopOptionsBySurveyQuestions(@Param("surveyQuestions") List<SurveyQuestion> surveyQuestions);
}

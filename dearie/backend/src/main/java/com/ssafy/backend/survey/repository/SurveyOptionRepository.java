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

    @Query(value = """
        SELECT SUM(max_scores.max_score) as total
        FROM (
            SELECT MAX(so.score) AS max_score
            FROM survey_options so
            JOIN survey_questions sq ON so.survey_questions_id = sq.id
            WHERE sq.survey_templates_id = :templateId
            GROUP BY so.survey_questions_id
        ) AS max_scores
    """, nativeQuery = true)
    Integer getSumOfMaxScoresByTemplateId(@Param("templateId") Long templateId);
}

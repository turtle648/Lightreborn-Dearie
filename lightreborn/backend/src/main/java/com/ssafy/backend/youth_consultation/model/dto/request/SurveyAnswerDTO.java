package com.ssafy.backend.youth_consultation.model.dto.request;

import lombok.*;

@Data
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SurveyAnswerDTO {
    private String answerText;
    private String answerChoice;
    private String question;
}

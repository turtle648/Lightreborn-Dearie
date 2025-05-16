package com.ssafy.backend.youth_consultation.model.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SurveySendRequestDTO {
    // == survey ==
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS")
    private LocalDateTime createdAt;
    private String surveyResult;

    private UserInfoDTO user;
    private List<SurveyAnswerDTO> answers;
}

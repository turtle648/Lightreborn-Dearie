package com.ssafy.backend.diary.model.response;

import com.ssafy.backend.diary.model.entity.EmotionTag;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GetDiaryDto {
    private Long diaryId;
    private String content;
    private String createTime;
    private List<String> images;
    private String AiComment;
    private EmotionTag emotionTag;
    private String stamp;
}

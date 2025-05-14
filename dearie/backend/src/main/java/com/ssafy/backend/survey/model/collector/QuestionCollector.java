package com.ssafy.backend.survey.model.collector;

import com.ssafy.backend.survey.model.dto.response.QuestionDTO;

import java.util.ArrayList;
import java.util.List;

public class QuestionCollector {
    private final List<QuestionDTO> questionDTOS = new ArrayList<>();

    public void add (QuestionDTO questionDTO) {
        questionDTOS.add(questionDTO);
    }

    public List<QuestionDTO> getQuestionDTOS() {
        return List.copyOf(questionDTOS);
    }
}

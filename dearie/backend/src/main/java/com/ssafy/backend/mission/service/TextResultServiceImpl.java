package com.ssafy.backend.mission.service;

import com.ssafy.backend.mission.model.entity.TextResult;
import com.ssafy.backend.mission.repository.TextResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TextResultServiceImpl implements TextResultService {

    private final TextResultRepository textResultRepository;

    @Override
    public TextResult save(TextResult textResult) {
        return textResultRepository.save(textResult);
    }
}
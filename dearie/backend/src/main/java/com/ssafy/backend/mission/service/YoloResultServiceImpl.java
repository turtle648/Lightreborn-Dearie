package com.ssafy.backend.mission.service;

import com.ssafy.backend.mission.model.entity.YoloResult;
import com.ssafy.backend.mission.repository.YoloResultRepository;
import com.ssafy.backend.mission.service.YoloResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class YoloResultServiceImpl implements YoloResultService {

    private final YoloResultRepository yoloResultRepository;

    @Override
    public YoloResult save(YoloResult yoloResult) {
        return yoloResultRepository.save(yoloResult);
    }
}

package com.ssafy.backend.mission.service;

import com.ssafy.backend.mission.model.entity.WalkResult;
import com.ssafy.backend.mission.repository.WalkResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WalkResultServiceImpl implements WalkResultService {

    private final WalkResultRepository walkResultRepository;

    @Override
    public WalkResult save(WalkResult walkResult) {
        return walkResultRepository.save(walkResult);
    }
}

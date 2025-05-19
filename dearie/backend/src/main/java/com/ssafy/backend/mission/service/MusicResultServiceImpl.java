package com.ssafy.backend.mission.service;

import com.ssafy.backend.mission.model.entity.MusicResult;
import com.ssafy.backend.mission.repository.MusicResultRepository;
import com.ssafy.backend.mission.service.MusicResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MusicResultServiceImpl implements MusicResultService {

    private final MusicResultRepository musicResultRepository;

    @Override
    public MusicResult save(MusicResult musicResult) {
        return musicResultRepository.save(musicResult);
    }
}
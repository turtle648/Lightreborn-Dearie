package com.ssafy.backend.mission.service;

import ai.djl.translate.TranslateException;
import com.ssafy.backend.common.client.OpenCvYoloService;
import com.ssafy.backend.auth.model.entity.User;
import com.ssafy.backend.auth.repository.UserRepository;
import com.ssafy.backend.common.client.dto.YoloDetectionResult;
import com.ssafy.backend.common.config.S3Uploader;
import com.ssafy.backend.mission.model.dto.request.MissionCompletionRequestDTO;
import com.ssafy.backend.mission.model.dto.response.DailyMissionResponseDTO;
import com.ssafy.backend.mission.model.dto.response.MissionCompletionResponseDTO;
import com.ssafy.backend.mission.model.dto.vo.ImageResultDetail;
import com.ssafy.backend.mission.model.enums.MissionResultType;
import com.ssafy.backend.mission.repository.MissionRepository;
import com.ssafy.backend.mission.service.verification.ImageVerificationService;
import com.ssafy.backend.mission.model.entity.Mission;
import com.ssafy.backend.mission.model.entity.UserMission;
import com.ssafy.backend.mission.repository.UserMissionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MissionServiceImpl implements MissionService {

    private final MissionRepository missionRepository;
    private final S3Uploader s3Uploader;

    private final OpenCvYoloService openCvYoloService;
    private final ImageVerificationService imageVerificationService;
    private final UserRepository userRepository;
    private final UserMissionRepository userMissionRepository;


    @Override
    public MissionCompletionResponseDTO<?> verifyMissionCompletion(MissionCompletionRequestDTO request) throws IOException, TranslateException {
        MissionResultType resultType = request.getMissionResultType();
        log.info("verifyMissionCompletion resultType:{}", resultType);
        MissionCompletionResponseDTO<?> response;

        switch(resultType){
            case TEXT :
            {
                log.info("TEXT 미션 검증 시작");
            }
            case WALK :
            {
                log.info("WALK 미션 검증 시작");
            }
            case IMAGE :
            {
                log.info("IMAGE 미션 검증 시작");

                ImageResultDetail imageResult = processImageMission(request);
                response = createResponse(request.getMissionId(), resultType, imageResult.isVerified(),imageResult);

                return response;
            }
            case MUSIC :
            {
                log.info("MUSIC 미션 검증 시작");

            }
            default :
            {
                throw new BadRequestException("올바르지 않은 미션 키워드입니다.");
            }
        }
    }

    /**
     * 공통 응답 생성 메서드 - 제네릭 타입 사용
     */
    private <T> MissionCompletionResponseDTO<T> createResponse(Long missionId, MissionResultType resultType, boolean isVerified, T detail) {
        MissionCompletionResponseDTO<T> response = new MissionCompletionResponseDTO<>();
        response.setUserMissionId(missionId);
        response.setResultType(resultType);
        response.setVerified(isVerified);
        response.setCompletedAt(LocalDateTime.now());
        response.setDetail(detail);
        return response;
    }

    /**
     * 이미지 미션 처리 로직
     */
    private ImageResultDetail processImageMission(MissionCompletionRequestDTO request) throws IOException, TranslateException {
        log.info("ProcessImageMission 시작");

        // 1) 파일 유효성 검사
        MultipartFile file = request.getImageFile();
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("이미지를 전송해주세요.");
        }

        // 2) S3 업로드
        String imageUrl = s3Uploader.upload("missions/image/" + request.getMissionId(), file);
        log.info("imageUrl:{}", imageUrl);

        // 3) YOLO 호출
        //List<YoloDetectionResult> detections = yoloInferenceService.detectFromUrl(imageUrl);
        List<YoloDetectionResult> detections = openCvYoloService.detectFromUrl(imageUrl);


        // 4) 이미지 키워드별 검증 수행
        ImageResultDetail imageResult = imageVerificationService.verifyImage(request, imageUrl, detections);

        return imageResult;
    }


    @Override
    public List<DailyMissionResponseDTO> getDailyMissionList(Long userId) {

        LocalDate today = LocalDate.now();

        List<UserMission> ums = userMissionRepository
                .findByUser_IdAndDate(userId, today);


        return ums.stream()
                .map(um -> new DailyMissionResponseDTO(
                        um.getId(),
                        um.getMission().getId(),
                        um.getMission().getMissionTitle(),
                        um.getMission().getContent(),
                        um.getIsCompleted(),
                        um.getMission().getMissionType().getType()
                ))
                .toList();
    }

    @Override
    @Transactional
    public void assignDailyMissionsToAllUsers() {
        /*
        * 매일 자정 스케줄러에서 호출
        * 모든 사용자에게 랜덤 5개 미션을 user_mission에 저장
        * */
        List<Mission> allMissions = missionRepository.findAll();
        List<User> allUsers = userRepository.findAll();

        for(User user : allUsers){
            // 미션 리스트를 섞어서 앞의 5개만 취하기
            Collections.shuffle(allMissions);
            List<Mission> picked = allMissions.stream()
                    .limit(Math.min(5, allMissions.size()))
                    .toList();

            List<UserMission> toSave = picked.stream()
                    .map(m -> UserMission.builder()
                            .user(user)
                            .mission(m)
                            .date(LocalDate.now())
                            .isCompleted(false)
                            .build())
                    .toList();

            userMissionRepository.saveAll(toSave);
        }

    }

    @Override
    @Transactional
    public void deleteStableUserMissions() {
        // 오늘 기준 5일 전, isCompleted=false인 미션 삭제
        LocalDate threshold = LocalDate.now().minusDays(5);
        userMissionRepository.deleteByDateBeforeAndIsCompletedFalse(threshold);
    }
}

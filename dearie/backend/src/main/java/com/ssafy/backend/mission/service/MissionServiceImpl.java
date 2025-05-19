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
import com.ssafy.backend.mission.model.dto.response.MissionDetailResponseDTO;
import com.ssafy.backend.mission.model.dto.response.RecentMissionResponseDTO;
import com.ssafy.backend.mission.model.dto.vo.ImageResultDetail;
import com.ssafy.backend.mission.model.dto.vo.MusicResultDetail;
import com.ssafy.backend.mission.model.dto.vo.TextResultDetail;
import com.ssafy.backend.mission.model.dto.vo.WalkResultDetail;
import com.ssafy.backend.mission.model.entity.*;
import com.ssafy.backend.mission.model.enums.MissionExecutionType;
import com.ssafy.backend.mission.repository.*;
import com.ssafy.backend.mission.service.verification.ImageVerificationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
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
    private final MissionResultRepository missionResultRepository;
    private final TextResultRepository textResultRepository;
    private final MusicResultRepository musicResultRepository;
    private final WalkResultRepository walkResultRepository;
    private final YoloResultRepository yoloResultRepository;


    @Override
    public MissionCompletionResponseDTO<?> verifyMissionCompletion(Long userMissionId, Long uuid, MissionCompletionRequestDTO request,
               MultipartFile snapshotFile) throws IOException, TranslateException {
        MissionExecutionType executionType = request.getMissionExecutionType();
        log.info("verifyMissionCompletion resultType:{}", executionType);
        MissionCompletionResponseDTO<?> response;

        UserMission userMission = userMissionRepository.findById(userMissionId)
                .filter(um -> um.getUser().getId().equals(uuid))
                .orElseThrow(() -> new BadRequestException("해당 유저의 미션이 아닙니다."));

        // 1. MissionResult 생성
        MissionResult missionResult = MissionResult.of(userMission, executionType, "");
        missionResult = missionResultRepository.save(missionResult);

        String missionTitle = userMission.getMission().getMissionTitle();
        String missionContent = userMission.getMission().getContent();

        //Generic detail 반환
        Object resDetail = switch(executionType){
            case TEXT ->
            {
                log.info("TEXT 미션 검증 시작");

                TextResult textResult = TextResult.of(missionResult, request.getTextContent());

                completeMission(
                        missionResult,
                        userMission,
                        () -> textResultRepository.save(textResult),
                        "text:" + request.getTextContent()
                );

                yield new TextResultDetail(request.getTextContent(), true);
            }
            case MUSIC ->
            {
                MusicResult musicResult = MusicResult.of(
                        missionResult,
                        request.getArtist(),
                        request.getTitle(),
                        request.getMusicImageUrl()
                );

                completeMission(
                        missionResult,
                        userMission,
                        () -> musicResultRepository.save(musicResult),
                        "text:" + request.getTextContent()
                );

                yield new MusicResultDetail(request.getTitle(), request.getArtist(), request.getMusicImageUrl(), true);
            }
            case IMAGE ->
            {
                log.info("IMAGE 미션 검증 시작");

                ImageResultDetail imageResult = processImageMission(request);

                YoloResult yoloResult = YoloResult.of(
                        missionResult,
                        request.getImageKeyword(),
                        imageResult.getS3ImageUrl()
                );

                completeMission(
                        missionResult,
                        userMission,
                        () -> yoloResultRepository.save(yoloResult),
                        "image:" + request.getTextContent()
                );

                yield imageResult;
            }
            case WALK ->
            {
                String pathJson = request.getPathJson();

                if (snapshotFile == null || snapshotFile.isEmpty() || pathJson == null) {
                    throw new BadRequestException("산책 경로 데이터 또는 스냅샷이 누락되었습니다.");
                }

                String pathKey = String.format("walk/%d/path-%d.json", missionResult.getId(), System.currentTimeMillis());
                String pathUrl = s3Uploader.uploadBytes(pathKey, pathJson.getBytes(StandardCharsets.UTF_8), "application/json");

                String snapshotKey = String.format("walk/%d/snapshot-%d.png", missionResult.getId(), System.currentTimeMillis());
                String snapshotUrl = s3Uploader.upload(snapshotKey, snapshotFile);

                WalkResult walkResult = WalkResult.builder()
                        .missionResult(missionResult)
                        .startTime(request.getStartTime())
                        .endTime(request.getEndTime())
                        .duration(Duration.between(request.getStartTime(), request.getEndTime()))
                        .pathFileUrl(pathUrl)
                        .snapshotUrl(snapshotUrl)
                        .verified(true)
                        .distance(request.getDistance())
                        .build();

                completeMission(
                        missionResult,
                        userMission,
                        () -> walkResultRepository.save(walkResult),
                        "image:" + request.getTextContent()
                );

                yield new WalkResultDetail(walkResult.getId(),
                        request.getStartTime(),
                        request.getEndTime(),
                        Duration.between(request.getStartTime(), request.getEndTime()),
                        pathUrl,
                        snapshotUrl,
                        LocalDateTime.now(),
                        userMissionId,
                        missionResult.getId(),
                        true
                );
            }
            default ->
            {
                throw new BadRequestException("잘못된 미션 타입입니다.");
            }
        };

        return createResponse(request.getMissionId(), missionTitle, missionContent, executionType, resDetail);
    }

    private void completeMission(
            MissionResult missionResult,
            UserMission userMission,
            Runnable saveResultLogic, // repository.save() 같은 걸 람다로 전달
            String valueToUpdate
    ) {
        saveResultLogic.run(); // 각각의 결과 저장 로직 실행
        missionResult.updateValue(valueToUpdate);
        missionResult.verify();
        missionResultRepository.save(missionResult);

        userMission.markCompleted();
        userMissionRepository.save(userMission);
    }

    /**
     * 공통 응답 생성 메서드 - 제네릭 타입 사용
     */
    private <T> MissionCompletionResponseDTO<T> createResponse(Long missionId, String missionTitle, String missionContent, MissionExecutionType resultType, T detail) {
        MissionCompletionResponseDTO<T> response = new MissionCompletionResponseDTO<>();
        response.setUserMissionId(missionId);
        response.setResultType(resultType);
        response.setCompletedAt(LocalDateTime.now());
        response.setDetail(detail);
        response.setMissionTitle(missionTitle);
        response.setMissionContent(missionContent);
        return response;
    }

    /**
     * 공통 응답 생성 메서드 - 제네릭 타입 사용
     */
    private <T> MissionDetailResponseDTO<T> createResponse(String missionTitle, String missionContent, MissionExecutionType missionExecutionType, T detail) {
        return new MissionDetailResponseDTO<>(
                missionTitle,
                missionContent,
                LocalDate.now(),
                missionExecutionType,
                detail
        );
    }

    /**
     * 이미지 미션 처리 로직
     */
    private ImageResultDetail processImageMission(MissionCompletionRequestDTO request) throws IOException {
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

    @Override
    @Transactional
    public List<RecentMissionResponseDTO> getRecentCompleteMissions(Long userId, int page) {
        Pageable pageable = PageRequest.of(page, 5, Sort.by(Sort.Direction.DESC, "date"));

        List<UserMission> completedMissions = userMissionRepository.findByUser_IdAndIsCompletedTrue(
                userId, pageable
        );

        return completedMissions.stream().map(um -> {
            Mission mission = um.getMission();
            MissionResult result = missionResultRepository.findTopByUserMissionIdOrderByCreatedAtDesc(um.getId())
                    .orElse(null);

            MissionExecutionType executionType = mission.getMissionExecutionType();

            String imageUrl = null;
            if (result != null) {
                switch (executionType) {
                    case WALK -> imageUrl = walkResultRepository.findByMissionResult(result).map(WalkResult::getSnapshotUrl).orElse(null);
                    case IMAGE -> imageUrl = yoloResultRepository.findByMissionResult(result).map(YoloResult::getImageUrl).orElse(null);
                    case MUSIC -> imageUrl = musicResultRepository.findByMissionResult(result).map(MusicResult::getThumbnail).orElse(null);
                    case TEXT -> imageUrl = null;
                }
            }

            return new RecentMissionResponseDTO(
                    um.getId(),
                    mission.getMissionTitle(),
                    um.getDate(),
                    mission.getContent(),
                    mission.getMissionType().getType().name(),
                    executionType,
                    imageUrl
            );
        }).toList();
    }

    @Override
    @Transactional
    public MissionDetailResponseDTO<?> getCompletedMissionDetail(Long userMissionId, Long userId, MissionExecutionType executionType) {
        UserMission userMission = userMissionRepository.findById(userMissionId)
                .filter(um -> um.getUser().getId().equals(userId))
                .orElseThrow(() -> new IllegalArgumentException("해당 유저의 미션이 아닙니다."));

        Mission mission = userMission.getMission();
        MissionResult result = missionResultRepository.findByUserMission_IdAndUserMission_Mission_MissionExecutionType(userMissionId, executionType)
                .orElseThrow(() -> new IllegalArgumentException("해당 미션의 결과가 존재하지 않습니다."));

        log.info("result: {}, {}", result.getValue(), result.getCreatedAt());

        Object resDetail = switch (executionType) {
            case WALK -> {
                WalkResult walk = walkResultRepository.findByMissionResult(result)
                        .orElseThrow(() -> new IllegalArgumentException("산책 결과가 없습니다."));

                yield new WalkResultDetail(walk.getId(),
                        walk.getStartTime(),
                        walk.getEndTime(),
                        Duration.between(walk.getStartTime(), walk.getEndTime()),
                        walk.getPathFileUrl(),
                        walk.getSnapshotUrl(),
                        LocalDateTime.now(),
                        userMissionId,
                        result.getId(),
                        true
                );

            }
            case IMAGE -> {
                YoloResult yolo = yoloResultRepository.findByMissionResult(result)
                        .orElseThrow(() -> new IllegalArgumentException("이미지 결과가 없습니다."));

                yield new ImageResultDetail(
                        List.of(), // 실제 YOLO 감지 리스트가 있다면 여기에
                        yolo.getImageKeyword(),
                        true,
                        yolo.getImageUrl()
                );

            }
            case MUSIC -> {
                MusicResult music = musicResultRepository.findByMissionResult(result)
                        .orElseThrow(() -> new IllegalArgumentException("음악 결과가 없습니다."));

                yield new MusicResultDetail(
                        music.getTitle(),
                        music.getSinger(),
                        music.getThumbnail(),
                        true
                );

            }
            case TEXT -> {
                TextResult textResult = textResultRepository.findByMissionResult(result)
                        .orElseThrow(() -> new IllegalArgumentException("텍스트 결과가 없습니다."));

                yield new TextResultDetail(textResult.getContent(), true);
            }
        };

        return createResponse(mission.getMissionTitle(),
                mission.getContent(),
                executionType, resDetail);
    }
}

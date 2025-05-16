package com.ssafy.backend.mission.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.backend.auth.model.entity.User;
import com.ssafy.backend.auth.repository.UserRepository;
import com.ssafy.backend.common.client.YoloClientService;
import com.ssafy.backend.common.client.dto.YoloDetectionResult;
import com.ssafy.backend.common.config.S3Uploader;
import com.ssafy.backend.mission.model.dto.request.MissionCompletionRequestDTO;
import com.ssafy.backend.mission.model.dto.response.DailyMissionResponseDTO;
import com.ssafy.backend.mission.model.dto.response.MissionCompletionResponseDTO;
import com.ssafy.backend.mission.model.dto.vo.ImageResultDetail;
import com.ssafy.backend.mission.model.entity.Mission;
import com.ssafy.backend.mission.model.entity.UserMission;
import com.ssafy.backend.mission.model.enums.MissionResultType;
import com.ssafy.backend.mission.repository.MissionRepository;
import com.ssafy.backend.mission.repository.UserMissionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.attribute.UserPrincipal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MissionServiceImpl implements MissionService {

    private final MissionRepository missionRepository;
    private final S3Uploader s3Uploader;
    private final YoloClientService yoloClientService;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;
    private final UserMissionRepository userMissionRepository;


    @Override
    public MissionCompletionResponseDTO<?> verifyMissionCompletion(MissionCompletionRequestDTO request) throws BadRequestException {
        MissionResultType resultType = request.getMissionResultType();

        switch(resultType){
            case TEXT :
            {
            }
            case WALK :
            {

            }
            case IMAGE :
            {
                // 1) 파일 유효성 검사
                MultipartFile file = request.getImageFile();
                if (file == null || file.isEmpty()) {
                    throw new BadRequestException("이미지를 전송해주세요.");
                }

                // 2) S3 업로드
                String imageUrl = s3Uploader.upload("missions/image" + request.getMissionId(), file);

                // 3) YOLO 호출 → List<DetectedObject>
                List<YoloDetectionResult> detections =
                        yoloClientService.detectImage(request.getMissionId(), imageUrl)
                                .block();

                // 4) 미션 요구 객체 확인
                boolean isVerified = false;
                String requiredLabel = missionRepository.findById(request.getMissionId())
                        .map(Mission::getRequiredObjectLabel)
                        .orElse(request.getImageKeyword()); // 미션에 지정된 객체 또는 요청에서 제공된 키워드

                if (requiredLabel != null) {
                    isVerified = detections.stream()
                            .anyMatch(obj -> obj.getLabel().equals(requiredLabel) && obj.getConfidence() > 0.5);
                }

                // 5) Mission 응답 스펙에 맞게 래핑
                ImageResultDetail detail = new ImageResultDetail(detections, request.getImageKeyword(), isVerified);

                MissionCompletionResponseDTO<ImageResultDetail> response = new MissionCompletionResponseDTO<>();
                response.setUserMissionId(request.getMissionId());
                response.setResultType(MissionResultType.IMAGE);
                response.setVerified(isVerified);
                response.setCompletedAt(LocalDateTime.now());
                response.setDetail(detail);

                return response;
            }
            case MUSIC :
            {

            }
            default :
            {
                throw new BadRequestException("이미지를 전송해주세요.");

            }
        }
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

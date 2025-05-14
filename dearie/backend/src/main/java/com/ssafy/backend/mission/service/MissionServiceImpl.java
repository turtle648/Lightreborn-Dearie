package com.ssafy.backend.mission.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.backend.common.client.YoloClientService;
import com.ssafy.backend.common.client.dto.YoloDetectionResult;
import com.ssafy.backend.common.config.S3Uploader;
import com.ssafy.backend.mission.model.dto.request.MissionCompletionRequestDTO;
import com.ssafy.backend.mission.model.dto.response.DailyMissionResponseDTO;
import com.ssafy.backend.mission.model.dto.response.MissionCompletionResponseDTO;
import com.ssafy.backend.mission.model.dto.vo.ImageResultDetail;
import com.ssafy.backend.mission.model.entity.Mission;
import com.ssafy.backend.mission.model.enums.MissionResultType;
import com.ssafy.backend.mission.repository.MissionRepository;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MissionServiceImpl implements MissionService {

    private final MissionRepository missionRepository;
    private final S3Uploader s3Uploader;
    private final YoloClientService yoloClientService;
    private final ObjectMapper objectMapper;

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
    public List<DailyMissionResponseDTO> getDailyMissionList() {
        return missionRepository.findRandomMissions().stream()
                .map(m -> new DailyMissionResponseDTO(m.getId(), m.getContent(), m.getMissionType().getType()))
                .toList();
    }
}

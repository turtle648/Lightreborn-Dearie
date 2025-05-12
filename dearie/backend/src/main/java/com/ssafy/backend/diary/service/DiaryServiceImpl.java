package com.ssafy.backend.diary.service;

import com.ssafy.backend.auth.model.entity.User;
import com.ssafy.backend.auth.repository.UserRepository;
import com.ssafy.backend.common.config.S3Uploader;
import com.ssafy.backend.diary.model.entity.Diary;
import com.ssafy.backend.diary.model.entity.DiaryImage;
import com.ssafy.backend.diary.model.response.GetDiaryDetailDto;
import com.ssafy.backend.diary.repository.DiaryImageRepository;
import com.ssafy.backend.diary.repository.DiaryRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DiaryServiceImpl implements DiaryService {

    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;
    private final S3Uploader s3Uploader;
    private final DiaryImageRepository diaryImageRepository;

    public DiaryServiceImpl(DiaryRepository diaryRepository,
                            UserRepository userRepository,
                            S3Uploader s3Uploader,
                            DiaryImageRepository diaryImageRepository
    ) {
        this.diaryRepository = diaryRepository;
        this.userRepository = userRepository;
        this.s3Uploader = s3Uploader;
        this.diaryImageRepository = diaryImageRepository;
    }

    @Override
    public GetDiaryDetailDto getDiary(Long diaryId, String userLoginId) {
        Diary diary = diaryRepository.findByIdAndUser_LoginId(diaryId, userLoginId)
                .orElseThrow(() -> new AccessDeniedException("자신의 일기만 조회할 수 없습니다."));

        List<String> images = diary.getImages().stream()
                .map(DiaryImage::getImageUrl)
                .collect(Collectors.toList());

        GetDiaryDetailDto result = new GetDiaryDetailDto();
        result.setContent(diary.getContent());
        result.setAiComment(diary.getAiComment());
        result.setImages(images);
        result.setEmotionTag(diary.getEmotionTag() != null ? diary.getEmotionTag().toString() : "UNKNOWN");
        result.setCreateTime(diary.getCreatedAt().toString());

        return result;
    }

    @Override
    @Transactional
    public Long createDiaryWithImages(String content, Diary.EmotionTag emotionTag, List<MultipartFile> images, String userId) {
        // 1. 사용자 조회
        User user = userRepository.findByLoginId(userId)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 사용자 ID"));

        // 2. 일기 엔티티 생성
        Diary diary = Diary.builder()
                .content(content)
                .createdAt(LocalDateTime.now())
                .user(user)
                .EmotionTag(emotionTag)
                .build();

        // 3. 일기 저장 (ID 생성)
        diaryRepository.save(diary);

        // 4. 이미지 업로드 및 저장
        if (images != null && !images.isEmpty()) {
            List<DiaryImage> diaryImages = new ArrayList<>();

            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    try {
                        // 파일 확장자 추출
                        String originalFilename = image.getOriginalFilename();
                        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));

                        // S3 키 생성
                        String key = String.format("diary/%s/%s%s",
                                userId,
                                UUID.randomUUID().toString(),
                                extension);

                        // S3에 업로드하고 URL 저장
                        String imageUrl = s3Uploader.upload(key, image);

                        // 이미지 엔티티 생성
                        DiaryImage diaryImage = DiaryImage.builder()
                                .imageUrl(imageUrl)
                                .diary(diary)
                                .build();

                        diaryImages.add(diaryImage);
                    } catch (Exception e) {
//                        log.error("이미지 업로드 실패: {}", e.getMessage(), e);
                        // 특정 이미지 실패해도 계속 진행
                    }
                }
            }

            // 이미지 엔티티 일괄 저장
            if (!diaryImages.isEmpty()) {
                diaryImageRepository.saveAll(diaryImages);
            }
        }

        return diary.getId();
    }
}

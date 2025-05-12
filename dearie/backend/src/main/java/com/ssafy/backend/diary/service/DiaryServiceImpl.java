package com.ssafy.backend.diary.service;


import com.ssafy.backend.auth.model.entity.User;
import com.ssafy.backend.auth.repository.UserRepository;
import com.ssafy.backend.diary.model.entity.Diary;
import com.ssafy.backend.diary.model.entity.DiaryImage;
import com.ssafy.backend.diary.model.request.CreateDiaryRequestDTO;
import com.ssafy.backend.diary.model.response.GetDiaryDetailDto;
import com.ssafy.backend.diary.repository.DiaryRepository;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DiaryServiceImpl implements DiaryService {

    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;

    public DiaryServiceImpl(DiaryRepository diaryRepository, UserRepository userRepository) {
        this.diaryRepository = diaryRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    @Override
    public Long createDiary(CreateDiaryRequestDTO requestDto, List<MultipartFile> images){
        User user = userRepository.findById(requestDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 사용자 ID"));

        Diary diary = Diary.builder()
                .content(requestDto.getContent())
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

//        // 이미지 저장
//        if (images != null) {
//            List<DiaryImage> imageEntities = images.stream()
//                    .map(file -> {
//                        String s3Url = s3Service.upload(file); // 실제 S3 업로드 수행
//                        return DiaryImage.builder()
//                                .imageUrl(s3Url)
//                                .diary(diary)
//                                .build();
//                    }).toList();
//
//            diary.getImages().addAll(imageEntities);
//        }

        diaryRepository.save(diary);
        return diary.getId();
    }

    @Override
    public GetDiaryDetailDto getDiary(Long diaryId, String userLoginId) {
        Diary diary = diaryRepository.findByIdAndUser_LoginId(diaryId, userLoginId)
                .orElseThrow(() -> new AccessDeniedException("자신의 일기만 조회할 수 없습니다."));

        List<String> images = diary.getImages().stream()
                .map(DiaryImage::getImageUrl)
                .toList();

        GetDiaryDetailDto result = new GetDiaryDetailDto();
        result.setContent(diary.getContent());
        result.setAiComment(diary.getAiComment());
        result.setImages(images);
        result.setEmotionTag(
                diary.getEmotionTag() != null ? diary.getEmotionTag().toString() : "UNKNOWN"
        );
        result.setCreateTime(diary.getCreatedAt().toString());

        return result;
    }
}

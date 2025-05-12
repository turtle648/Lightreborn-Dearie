package com.ssafy.backend.diary.repository;

import com.ssafy.backend.diary.model.entity.Diary;
import com.ssafy.backend.diary.model.response.GetDiaryDetailDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface DiaryRepository extends JpaRepository<Diary, Long> {

    Diary getDiaryById(Long id);

    Optional<Diary> findByIdAndUser_LoginId(Long id, String loginId);


}

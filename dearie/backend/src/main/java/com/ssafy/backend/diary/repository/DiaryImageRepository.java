package com.ssafy.backend.diary.repository;

import com.ssafy.backend.diary.model.entity.Diary;
import com.ssafy.backend.diary.model.entity.DiaryImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface DiaryImageRepository extends JpaRepository<DiaryImage, Long> {

}

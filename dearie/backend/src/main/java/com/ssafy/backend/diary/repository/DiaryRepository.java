package com.ssafy.backend.diary.repository;

import com.ssafy.backend.diary.model.entity.Diary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface DiaryRepository extends JpaRepository<Diary, Long> {



}

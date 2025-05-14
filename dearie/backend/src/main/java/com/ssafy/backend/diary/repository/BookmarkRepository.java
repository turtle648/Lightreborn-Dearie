package com.ssafy.backend.diary.repository;

import com.ssafy.backend.auth.model.entity.User;
import com.ssafy.backend.diary.model.entity.Bookmark;
import com.ssafy.backend.diary.model.entity.Diary;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    boolean existsByUserAndDiary(User user, Diary diary);
}

package com.ssafy.backend.diary.repository;

import com.ssafy.backend.auth.model.entity.User;
import com.ssafy.backend.diary.model.entity.Bookmark;
import com.ssafy.backend.diary.model.entity.Diary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    boolean existsByUserAndDiary(User user, Diary diary);

    Optional<Bookmark> findByUserAndDiary(User user, Diary diary);
}

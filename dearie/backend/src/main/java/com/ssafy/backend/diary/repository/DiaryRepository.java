package com.ssafy.backend.diary.repository;

import com.ssafy.backend.auth.model.entity.User;
import com.ssafy.backend.diary.model.entity.Diary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiaryRepository extends JpaRepository<Diary, Long> {
    @Modifying
    @Query("DELETE FROM Diary d WHERE d.id = :id AND d.user.loginId = :loginId")
    int deleteByIdAndUser_LoginId(@Param("id") Long id, @Param("loginId") String loginId);

    @Query("SELECT DISTINCT d FROM Diary d " +
            "LEFT JOIN Bookmark b ON d.id = b.diary.id AND b.user = :user " +
            "WHERE d.user = :user " +
            "AND (:bookmark IS NULL OR :bookmark = false OR (:bookmark = true AND b.id IS NOT NULL)) " +
            "AND (:keyword IS NULL OR LOWER(d.content) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Diary> findFilteredDiaries(
            @Param("user") User user,
            @Param("bookmark") Boolean bookmark,
            @Param("keyword") String keyword,
            Pageable pageable);

    List<Diary> findByUser(User user);
}
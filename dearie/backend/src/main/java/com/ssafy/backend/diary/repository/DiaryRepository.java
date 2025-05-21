package com.ssafy.backend.diary.repository;

import com.ssafy.backend.auth.model.entity.User;
import com.ssafy.backend.diary.model.entity.Diary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DiaryRepository extends JpaRepository<Diary, Long> {
    List<Diary> findByUserIdAndCreatedAtBetween(Long userId, LocalDateTime start, LocalDateTime end);

    @Modifying
    @Transactional
    @Query("UPDATE Diary d SET d.aiComment = :comment WHERE d.id = :id")
    void updateAiComment(@Param("id") Long id, @Param("comment") String comment);

    @Modifying
    @Query("DELETE FROM Diary d WHERE d.id = :id AND d.user.loginId = :loginId")
    int deleteByIdAndUser_LoginId(@Param("id") Long id, @Param("loginId") String loginId);

    @Query("SELECT d FROM Diary d " +
            "WHERE d.user = :user " +
            "AND (:keyword IS NULL OR d.content IS NULL OR CAST(d.content AS string) LIKE CONCAT('%', CAST(:keyword AS string), '%')) " +
            "AND (:bookmark IS NOT TRUE OR d.bookmarked = TRUE)")
    Page<Diary> findFilteredDiaries(
            @Param("user") User user,
            @Param("bookmark") Boolean bookmark,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    List<Diary> findByUser(User user);

    @Query(value = """
    SELECT COUNT(*) AS streak
    FROM (
        SELECT DATE(created_at) AS diary_date,
               ROW_NUMBER() OVER (ORDER BY DATE(created_at) DESC) AS rn
        FROM diary
        WHERE user_id = :userId AND DATE(created_at) <= CURRENT_DATE
        GROUP BY DATE(created_at)
    ) AS dated
    WHERE CURRENT_DATE - diary_date = rn - 1
    """, nativeQuery = true)
    Integer countConsecutiveDiaryDays(@Param("userId") Long userId);

    Integer countByUser_id(Long userId);

    Optional<Diary> findTopByUser_IdOrderByCreatedAtDesc(Long userId);
}

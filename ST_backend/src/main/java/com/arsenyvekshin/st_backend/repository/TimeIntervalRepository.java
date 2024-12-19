package com.arsenyvekshin.st_backend.repository;

import com.arsenyvekshin.st_backend.entity.TimeInterval;
import com.arsenyvekshin.st_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TimeIntervalRepository extends JpaRepository<TimeInterval, Long> {


    // Найти все интервалы, которые начинаются после указанной даты
    List<TimeInterval> findByBeginAfter(LocalDateTime begin);

    // Найти все интервалы, где время начала между двумя датами
    List<TimeInterval> findByBeginBetween(LocalDateTime start, LocalDateTime end);

    // Найти все интервалы, где task == null
    List<TimeInterval> findByTaskIsNull();

    // Найти все интервалы, где task == null и время начала между двумя датами
    List<TimeInterval> findByTaskIsNullAndBeginBetween(LocalDateTime start, LocalDateTime end);

    TimeInterval findByTaskIdAndUserId(Long taskId, Long userId);

    // Все интервалы после определенного времени, где task = null и meeting = null
    @Query("SELECT t FROM TimeInterval t WHERE t.user = :user AND t.task IS NULL AND t.meeting IS NULL AND t.begin > :startTime")
    List<TimeInterval> findAllAfterTimeForUser(@Param("user") User user, @Param("startTime") LocalDateTime startTime);

    // Все интервалы в промежутке времени, где task = null и meeting = null
    @Query("SELECT t FROM TimeInterval t WHERE t.user = :user AND t.task IS NULL AND t.meeting IS NULL AND t.begin BETWEEN :startTime AND :endTime")
    List<TimeInterval> findAllAvailableBetweenTimesForUser(@Param("user") User user, @Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    // Все интервалы в промежутке времени, где task = null и meeting = null
    @Query("SELECT t FROM TimeInterval t WHERE t.user = :user AND t.begin BETWEEN :startTime AND :endTime")
    List<TimeInterval> findAllBetweenTimesForUser(@Param("user") User user, @Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

}
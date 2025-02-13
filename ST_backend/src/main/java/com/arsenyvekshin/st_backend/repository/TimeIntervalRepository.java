package com.arsenyvekshin.st_backend.repository;

import com.arsenyvekshin.st_backend.entity.TimeInterval;
import com.arsenyvekshin.st_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TimeIntervalRepository extends JpaRepository<TimeInterval, Long> {


    // Найти все интервалы, которые начинаются после указанной даты
    List<TimeInterval> findByFinishAfter(LocalDateTime finish);

    // Найти все интервалы, где время начала между двумя датами
    List<TimeInterval> findByFinishBetween(LocalDateTime start, LocalDateTime finish);

    // Найти все интервалы, где task == null
    List<TimeInterval> findByTaskIsNull();

    // Найти все интервалы, где task == null и время начала между двумя датами
    List<TimeInterval> findByTaskIsNullAndFinishBetween(LocalDateTime start, LocalDateTime finish);

    //TimeInterval findByTaskIdAndUserId(Long taskId, Long userId);

    // Все интервалы после определенного времени, где task = null и meeting = null
    @Query("SELECT t FROM time_interval t WHERE t.owner = :user AND t.task IS NULL AND t.meeting IS NULL AND t.start > :start")
    List<TimeInterval> findAllAfterTimeForUser(@Param("user") User user, @Param("start") LocalDateTime start);

    // Все интервалы в промежутке времени, где task = null и meeting = null
    @Query("SELECT t FROM time_interval t WHERE t.owner = :user AND t.task IS NULL AND t.meeting IS NULL AND t.start BETWEEN :start AND :endTime ORDER BY t.start")
    List<TimeInterval> findAllAvailableBetweenTimesForUser(@Param("user") User user, @Param("start") LocalDateTime start, @Param("endTime") LocalDateTime endTime);

    // Все интервалы в промежутке времени, где task = null и meeting = null
    @Query("SELECT t FROM time_interval t WHERE t.owner = :user AND t.start BETWEEN :start AND :endTime")
    List<TimeInterval> findAllBetweenTimesForUser(@Param("user") User user, @Param("start") LocalDateTime start, @Param("endTime") LocalDateTime endTime);

    @Query("SELECT ti FROM time_interval ti WHERE ti.owner = :user ORDER BY ti.finish DESC LIMIT 1")
    Optional<TimeInterval> findMaxFinishByUserId(User user);
}
package com.arsenyvekshin.st_backend.repository;

import com.arsenyvekshin.st_backend.entity.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    // Поиск встреч приуроченных к задаче
    List<Meeting> findByTaskId(Long taskId);

    // Метод для поиска встреч по дате начала
    List<Meeting> findByStartAfter(LocalDateTime start);

    // Метод для поиска встреч по дате окончания
    List<Meeting> findByFinishBefore(LocalDateTime finish);

    // Метод для поиска встреч по ключевой точке
    List<Meeting> findByKeypointId(Long keypointId);

    // Метод для поиска встреч по месту
    List<Meeting> findByPlaceId(Long placeId);

    // Метод для поиска встреч по участникам (по пользователю)
    List<Meeting> findByMembersId(Long userId);

    // Метод для поиска встреч, которые повторяются через определённый период
    List<Meeting> findByRepeatPeriodNotNull();

}


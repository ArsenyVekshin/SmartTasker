package com.arsenyvekshin.st_backend.repository;


import com.arsenyvekshin.st_backend.entity.Board;
import com.arsenyvekshin.st_backend.entity.Task;
import com.arsenyvekshin.st_backend.entity.TaskStatus;
import com.arsenyvekshin.st_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {


    // Метод для поиска задач по доске
    List<Task> findByBoardId(Long boardId);

    @Query("SELECT DISTINCT t.board FROM Task t WHERE t.owner = :user")
    List<Board> findBoardsByUser(User user);

    List<Task> findTasksByBoardAndOwner(Board board, User owner);

    // Метод для поиска задач, которые начали выполняться после указанной даты
    List<Task> findByStartAfter(LocalDateTime start);

    // Метод для поиска задач, чьи дедлайны наступили до указанной даты
    List<Task> findByFinishBefore(LocalDateTime deadline);

    // Метод для поиска задач, у которых есть период повторения
    List<Task> findByRepeatPeriodNotNull();

    // Метод для поиска задач по ключевой точке
    List<Task> findByKeypointId(Long keypointId);

    // Метод для поиска задач, которые еще не завершены (по текущей дате)
    @Query("SELECT t FROM Task t WHERE t.finish > :now")
    List<Task> findTasksWithAvailableFinish(LocalDateTime now);

    // Поиск задач по статусу
    @Query("SELECT t FROM Task t WHERE t.status = :status")
    List<Task> findByStatus(TaskStatus status);

    // Поиск задач с конкретным статусом и доской
    @Query("SELECT t FROM Task t WHERE t.status = :status AND t.board.id = :boardId")
    List<Task> findByStatusAndBoardId(TaskStatus status, Long boardId);

    // Поиск задач, чей статус изменился после конкретной даты
    @Query("SELECT t FROM Task t WHERE t.status = :status AND t.start > :start")
    List<Task> findByStatusAndStartAfter(TaskStatus status, LocalDateTime start);

    // Поиск задач, чье время завершения (дедлайн) находится между двумя датами
    @Query("SELECT t FROM Task t WHERE t.finish BETWEEN :startDate AND :endDate")
    List<Task> findByFinishBetween(LocalDateTime startDate, LocalDateTime endDate);

    // Поиск задач по доске и статусу
    @Query("SELECT t FROM Task t WHERE t.board.id = :boardId AND t.status = :status")
    List<Task> findByBoardIdAndStatus(Long boardId, TaskStatus status);

}

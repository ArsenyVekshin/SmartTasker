package com.arsenyvekshin.st_backend.service;


import com.arsenyvekshin.st_backend.dto.TimeIntervalDto;
import com.arsenyvekshin.st_backend.entity.Task;
import com.arsenyvekshin.st_backend.entity.TimeInterval;
import com.arsenyvekshin.st_backend.entity.User;
import com.arsenyvekshin.st_backend.repository.TaskRepository;
import com.arsenyvekshin.st_backend.repository.TimeIntervalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class TimeIntervalService {
    static long MIN_INTERVAL_SIZE = 0;

    private final TimeIntervalRepository timeIntervalRepository;
    private final TaskRepository taskRepository;


    private final TaskService taskService;
    private final UserService userService;


    public List<TimeIntervalDto> getUserIntervalsBetween(LocalDateTime start, LocalDateTime end) {
        User user = userService.getCurrentUser();
        return timeIntervalRepository.findAllBetweenTimesForUser(user, start, end).stream().map(TimeIntervalDto::new).toList();
    }

    public List<TimeIntervalDto> getUserIntervalsBetween(User user, LocalDateTime start, LocalDateTime end) {
        return timeIntervalRepository.findAllBetweenTimesForUser(user, start, end).stream().map(TimeIntervalDto::new).toList();
    }


    public void addFreeInterval(LocalDateTime start, LocalDateTime end) {
        User user = userService.getCurrentUser();

        timeIntervalRepository.findAllBetweenTimesForUser(user, start.minusHours(9), end.plusHours(9)).stream().forEach(check -> {
            if (check.getBegin().isBefore(start) && start.isBefore(check.getEnd())) {
                throw new IllegalArgumentException("Пересечение интервалов: начало интервала находится в другом интервале");
            }
            if (check.getBegin().isBefore(end) && start.isBefore(check.getEnd())) {
                throw new IllegalArgumentException("Пересечение интервалов: конец интервала находится в другом интервале");
            }
        });

        TimeInterval current = new TimeInterval(user, start, end);
        timeIntervalRepository.save(current);
    }

    private void splitIntervalInDuration(TimeInterval interval, Duration duration) {
        if(interval.isLocked()) throw new IllegalArgumentException("Разделение невозможно: интервал заблокирован");
        if(interval.getDuration().compareTo(duration) <= 0) throw new IllegalArgumentException("Разделение невозможно: интервал меньше необходимой длины");

        TimeInterval second = new TimeInterval(userService.getCurrentUser(), interval.getBegin().plus(duration), interval.getEnd());
        interval.setEnd(interval.getBegin().plus(duration));
        interval.setDuration(duration);

        timeIntervalRepository.save(interval);
        timeIntervalRepository.save(second);
    }

    @Transactional
    public void allocateTaskIntoSchedule(Long task_id){
        User user = userService.getCurrentUser();
        Task task = taskService.findTask(task_id);
        List<TimeInterval> intervals = timeIntervalRepository.findAllAvailableBetweenTimesForUser(user, LocalDateTime.now(), task.getDeadline());

        Duration nonAllocated = task.getDuration();
        for (TimeInterval current : intervals){
            if(current.isLocked()) continue;
            if(current.getDuration().compareTo(nonAllocated) <= 0){
                current.setTask(task);
                nonAllocated = nonAllocated.minus(current.getDuration());
                timeIntervalRepository.save(current);
            }
            else if(current.getDuration().compareTo(nonAllocated) > 0) {
                splitIntervalInDuration(current, nonAllocated);
                current.setTask(task);
                nonAllocated = Duration.ZERO;
                timeIntervalRepository.save(current);
            }
            if(nonAllocated.isZero()) break;
        }

        if(!nonAllocated.isZero())
            throw new IllegalArgumentException("У вас недостаточно свободных интервалов, чтобы выполнить эту задачу.");
    }
    
}

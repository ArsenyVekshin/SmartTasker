package com.arsenyvekshin.st_backend.service;


import com.arsenyvekshin.st_backend.dto.TimeIntervalDto;
import com.arsenyvekshin.st_backend.entity.AllocatableObject;
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

    private final TaskService taskService;
    private final UserService userService;


    public List<TimeIntervalDto> getUserIntervalsBetween(LocalDateTime start, LocalDateTime end) {
        User user = userService.getCurrentUser();
        return timeIntervalRepository.findAllBetweenTimesForUser(user, start, end).stream().map(TimeIntervalDto::new).toList();
    }

    public List<TimeInterval> getUserIntervalsBetween(User user, LocalDateTime start, LocalDateTime end) {
        return timeIntervalRepository.findAllBetweenTimesForUser(user, start, end);
    }


    public void addFreeInterval(LocalDateTime start, LocalDateTime end) {
        User user = userService.getCurrentUser();

        timeIntervalRepository.findAllBetweenTimesForUser(user, start.minusHours(9), end.plusHours(9)).stream().forEach(check -> {
            if (check.getStart().isBefore(start) && start.isBefore(check.getFinish())) {
                throw new IllegalArgumentException("Пересечение интервалов: начало интервала находится в другом интервале");
            }
            if (check.getStart().isBefore(end) && start.isBefore(check.getFinish())) {
                throw new IllegalArgumentException("Пересечение интервалов: конец интервала находится в другом интервале");
            }
        });

        TimeInterval current = new TimeInterval(user, start, end);
        timeIntervalRepository.save(current);
    }

    private TimeInterval splitIntervalInDuration(TimeInterval interval, Duration duration) {
        if (interval.isLocked()) throw new IllegalArgumentException("Разделение невозможно: интервал заблокирован");
        if (interval.getDuration().compareTo(duration) <= 0)
            throw new IllegalArgumentException("Разделение невозможно: интервал меньше необходимой длины");

        TimeInterval second = new TimeInterval(userService.getCurrentUser(), interval.getStart().plus(duration), interval.getFinish());
        interval.setFinish(interval.getStart().plus(duration));
        interval.setDuration(duration);

        timeIntervalRepository.save(interval);
        timeIntervalRepository.save(second);
        return second;
    }

    @Transactional
    public void allocateIntoScheduleStable(AllocatableObject placeholder) {
        User user = userService.getCurrentUser();
        List<TimeInterval> intervals = timeIntervalRepository.findAllAvailableBetweenTimesForUser(user, LocalDateTime.now(), placeholder.getFinish());

        boolean isAllocated = false;
        for (TimeInterval current : intervals) {
            if (current.isLocked()) continue;
            if (current.isCapableForStable(placeholder)) {
                TimeInterval buff = splitIntervalInDuration(current, Duration.between(placeholder.getStart(), current.getStart()));
                splitIntervalInDuration(buff, placeholder.getDuration());
                buff.occupyBy(placeholder);
                timeIntervalRepository.save(buff);
                isAllocated = true;
            }
            if(isAllocated) break;
        }
        if(!isAllocated)
            throw new IllegalArgumentException("У вас нет свободных интервалов, чтобы поместить эту задачу на конкретное место в расписании.");
    }



    @Transactional
    public void allocateIntoSchedule(AllocatableObject placeholder) {
        if(placeholder.getFinish().isBefore(LocalDateTime.now()))
            throw new IllegalArgumentException("Дедлайн задачи уже прошел");
        User user = userService.getCurrentUser();

        List<TimeInterval> intervals = timeIntervalRepository.findAllAvailableBetweenTimesForUser(user, LocalDateTime.now(), placeholder.getFinish());

        Duration nonAllocated = placeholder.getDuration();
        for (TimeInterval current : intervals) {
            if (!current.isCapableFor(placeholder)) continue;
            if (current.getDuration().compareTo(nonAllocated) <= 0) {
                current.occupyBy(placeholder);
                nonAllocated = nonAllocated.minus(current.getDuration());
                timeIntervalRepository.save(current);
            } else if (current.getDuration().compareTo(nonAllocated) > 0) {
                splitIntervalInDuration(current, nonAllocated);
                current.occupyBy(placeholder);
                nonAllocated = Duration.ZERO;
                timeIntervalRepository.save(current);
            }
            if (nonAllocated.isZero()) break;
        }
        if (!nonAllocated.isZero())
            throw new IllegalArgumentException("У вас недостаточно свободных интервалов, чтобы выполнить эту задачу.");

        if(placeholder.getClass() == Task.class) taskService.occupyTask((Task) placeholder);
    }

}

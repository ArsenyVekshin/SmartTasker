package com.arsenyvekshin.st_backend.service;


import com.arsenyvekshin.st_backend.dto.TimeIntervalDto;
import com.arsenyvekshin.st_backend.entity.AllocatableObject;
import com.arsenyvekshin.st_backend.entity.Task;
import com.arsenyvekshin.st_backend.entity.TimeInterval;
import com.arsenyvekshin.st_backend.entity.User;
import com.arsenyvekshin.st_backend.repository.TimeIntervalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class TimeIntervalService {
    static long MIN_INTERVAL_SIZE = 0;

    private final TimeIntervalRepository timeIntervalRepository;

    private final TaskService taskService;
    private final UserService userService;


    public LocalDateTime getUserScheduleEnd() {
        User user = userService.getCurrentUser();
        Optional<TimeInterval> last = timeIntervalRepository.findMaxFinishByUserId(user);
        if (last.isPresent()) return last.get().getFinish();
        else return LocalDateTime.now();
    }

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
        return splitIntervalInDuration(interval, duration, userService.getCurrentUser());
    }
    private TimeInterval splitIntervalInDuration(TimeInterval interval, Duration duration, User user) {
        if (interval.isLocked()) throw new IllegalArgumentException("Разделение невозможно: интервал заблокирован");
        if (interval.getDuration().compareTo(duration) <= 0)
            throw new IllegalArgumentException("Разделение невозможно: интервал меньше необходимой длины");

        TimeInterval second = new TimeInterval(user, interval.getStart().plus(duration), interval.getFinish());
        interval.setFinish(interval.getStart().plus(duration));
        interval.setDuration(duration);

        timeIntervalRepository.save(interval);
        timeIntervalRepository.save(second);
        return second;
    }

    @Transactional
    public void allocateIntoScheduleStableRepeatable(AllocatableObject placeholder) {
        allocateIntoScheduleStableRepeatable(placeholder, userService.getCurrentUser());

    }
    @Transactional
    public void allocateIntoScheduleStableRepeatable(AllocatableObject placeholder, User user) {
        List<TimeInterval> intervals = timeIntervalRepository.findAllAvailableBetweenTimesForUser(user, placeholder.getStart().minusDays(1), getUserScheduleEnd());

        boolean isAllocated = false;
        Task moved = new Task();
        moved.setStart(placeholder.getStart());
        moved.setFinish(placeholder.getFinish());
        moved.setDuration(placeholder.getDuration());

        for (TimeInterval current : intervals) {
            if (current.isLocked()) continue;
            while(moved.getStart().isBefore(current.getStart())){
                moved.setStart(moved.getStart().plus(placeholder.getRepeatPeriod()));
                moved.setFinish(moved.getFinish().plus(placeholder.getRepeatPeriod()));
            }
            if (current.isCapableForStable(moved)) {
                TimeInterval buff = splitIntervalInDuration(current, Duration.between(current.getStart(), moved.getStart()));
                splitIntervalInDuration(buff, moved.getDuration());
                buff.occupyBy(placeholder);
                timeIntervalRepository.save(buff);
                isAllocated = true;
            }


        }
        if(!isAllocated)
            throw new IllegalArgumentException("У вас нет свободных интервалов, чтобы поместить " + placeholder.getName() + " на конкретное место в расписании.");
        if(placeholder.getClass() == Task.class) taskService.planTask((Task) placeholder);
    }

    @Transactional
    public void allocateIntoScheduleStable(AllocatableObject placeholder) {
        allocateIntoScheduleStable(placeholder, userService.getCurrentUser());
    }
    @Transactional
    public void allocateIntoScheduleStable(AllocatableObject placeholder, User user) {
        if(placeholder.getFinish().isBefore(LocalDateTime.now()))
            throw new IllegalArgumentException("Дедлайн " + placeholder.getName() + " уже прошел");
        if(!placeholder.getRepeatPeriod().isZero()) {
            allocateIntoScheduleStableRepeatable(placeholder, user);
            return;
        }

        List<TimeInterval> intervals = timeIntervalRepository.findAllAvailableBetweenTimesForUser(user, LocalDateTime.now(), placeholder.getFinish().plusDays(1));

        boolean isAllocated = false;
        for (TimeInterval current : intervals) {
            if (current.isLocked()) continue;
            if (current.isCapableForStable(placeholder)) {
                TimeInterval buff = splitIntervalInDuration(current, Duration.between(current.getStart(), placeholder.getStart()), user);
                if(buff.isPossibleToSplit(placeholder.getDuration())) {
                    splitIntervalInDuration(buff, placeholder.getDuration(), user);
                }
                buff.occupyBy(placeholder);
                timeIntervalRepository.save(buff);
                isAllocated = true;
            }
            if(isAllocated) break;
        }
        if(!isAllocated)
            throw new IllegalArgumentException("У вас нет свободных интервалов, чтобы поместить " + placeholder.getName() + " на конкретное место в расписании.");
        if(placeholder.getClass() == Task.class) taskService.planTask((Task) placeholder);
    }


    @Transactional
    public void allocateIntoSchedule(AllocatableObject placeholder) {
        allocateIntoSchedule(placeholder, userService.getCurrentUser());
    }

    @Transactional
    public void allocateIntoSchedule(AllocatableObject placeholder, User user) {
        if(placeholder.getFinish().isBefore(LocalDateTime.now()))
            throw new IllegalArgumentException("Дедлайн " + placeholder.getName() + " уже прошел");

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
            throw new IllegalArgumentException("У вас недостаточно свободных интервалов, чтобы выполнить " + placeholder.getName());

        if(placeholder.getClass() == Task.class) taskService.planTask((Task) placeholder);
    }

}

package com.arsenyvekshin.st_backend.service;


import com.arsenyvekshin.st_backend.dto.TimeIntervalDto;
import com.arsenyvekshin.st_backend.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ScheduleService {

   private final TimeIntervalService timeIntervalService;
    private final TaskService taskService;
    private final KanbanService kanbanService;
    private final MeetingService meetingService;
    private final PlaceService placeService;
    private final UserService userService;


    public List<TimeIntervalDto> getScheduleForDay(LocalDate date) {
        return timeIntervalService.getUserIntervalsBetween(date.atStartOfDay(), date.atTime(23, 59));
    }

    // Запланировать рабочие дни на месяц
    public void initWorkday(LocalTime dayStart, LocalTime dayEnd) {
        LocalDateTime begin = LocalDateTime.of(LocalDate.now(), dayStart);
        LocalDateTime end = LocalDateTime.of(LocalDate.now(), dayEnd);
        LocalDateTime monthEnd = LocalDateTime.of(LocalDate.now(), LocalTime.of(23, 59)).plusMonths(1);
        while(begin.isBefore(monthEnd)) {
            timeIntervalService.addFreeInterval(begin, end);
            begin = begin.plusDays(1);
            end = end.plusDays(1);
        }
    }

    public void generateSchedule(LocalDate startDate, LocalDate endDate) {

        User user = userService.getCurrentUser();
        LocalDateTime begin = LocalDateTime.of(startDate, LocalTime.of(0, 0));
        LocalDateTime end = LocalDateTime.of(endDate, LocalTime.of(23, 59));

        List<TimeInterval> intervals = timeIntervalService.getUserIntervalsBetween(user, begin, end);
        if (intervals.isEmpty()) throw new IllegalArgumentException("Свободных промежутков времени не найдено");

        List<Meeting> meetings = meetingService.getAllUserMeetings(user);
        List<Task> tasks = taskService.getUserTasks();
        if (tasks.isEmpty()) throw new IllegalArgumentException("У пользователя нет задач для размещения");

        for (Meeting meeting : meetings) {
            Meeting meet = meeting;
            if (meeting.getRepeatPeriod() != null) meet = meeting.clone();
        }

    }

}

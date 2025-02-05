package com.arsenyvekshin.st_backend.service;


import com.arsenyvekshin.st_backend.dto.TimeIntervalDto;
import com.arsenyvekshin.st_backend.entity.Meeting;
import com.arsenyvekshin.st_backend.entity.Place;
import com.arsenyvekshin.st_backend.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
        return timeIntervalService.getUserIntervalsBetween(LocalDateTime.from(date), LocalDateTime.from(date).plusDays(1));
    }

    // Запланировать рабочие дни на месяц
    public void initWorkday(LocalTime dayStart, LocalTime dayEnd) {
        LocalDateTime begin = LocalDateTime.from(LocalDate.now()).plusSeconds(dayStart.toSecondOfDay());
        LocalDateTime end = LocalDateTime.from(LocalDate.now()).plusSeconds(dayEnd.toSecondOfDay());
        LocalDateTime monthEnd = LocalDateTime.from(LocalDate.now()).plusMonths(1);
        while(begin.isBefore(monthEnd)) {
            timeIntervalService.addFreeInterval(begin, end);
            begin = begin.plusDays(1);
            end = end.plusDays(1);
        }
    }


}

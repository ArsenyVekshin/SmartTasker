package com.arsenyvekshin.st_backend.service;


import com.arsenyvekshin.st_backend.dto.TaskDto;
import com.arsenyvekshin.st_backend.dto.TimeIntervalDto;
import com.arsenyvekshin.st_backend.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;

import java.time.DayOfWeek;
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

    // Запланировать рабочие дни на неделю
    public void initWorkday(LocalTime dayStart, LocalTime dayEnd) {
        LocalDateTime scheduleStart = timeIntervalService.getUserScheduleEnd().plusDays(1);
        LocalDateTime begin = LocalDateTime.of(LocalDate.from(scheduleStart), dayStart);
        LocalDateTime end = LocalDateTime.of(LocalDate.from(scheduleStart), dayEnd);
        LocalDateTime monthEnd = LocalDateTime.of(LocalDate.from(scheduleStart), LocalTime.of(23, 59)).plusDays(7);
        while(begin.isBefore(monthEnd)) {
            if(begin.getDayOfWeek()!= DayOfWeek.SATURDAY && begin.getDayOfWeek()!= DayOfWeek.SUNDAY) {
                timeIntervalService.addFreeInterval(begin, end);
            }
            begin = begin.plusDays(1);
            end = end.plusDays(1);
        }
    }


    public void allocateTask(Long id, boolean isStable) {
        Task task = taskService.find(id);
        System.out.println(task.getDuration().toMinutes());
        userService.checkOwnership(task);
        if (isStable) timeIntervalService.allocateIntoScheduleStable(task);
        else timeIntervalService.allocateIntoSchedule(task);
    }

    public void allocateMeeting(Long id) {
        Meeting meeting = meetingService.find(id);
        userService.checkOwnership(meeting);
        timeIntervalService.allocateIntoScheduleStable(meeting);
    }

    @Transactional
    public void allocateMeetingFinal(Long id) {
        Meeting meeting = meetingService.find(id);
        userService.checkOwnership(meeting);
        if(meeting.getPlace() == null)
            throw new IllegalArgumentException("Задача не готова к размещению: выберите место проведения");
        if(meeting.getMembers().isEmpty())
            throw new IllegalArgumentException("Задача не готова к размещению: список участников пуст");

        timeIntervalService.allocateIntoScheduleStable(meeting);
        for(User member: meeting.getMembers()) {
            try {
                timeIntervalService.allocateIntoScheduleStable(meeting, member);
            } catch (Exception e) {
                throw new IllegalArgumentException("Не совместимо с расписанием пользователя " + member.getUsername());
            }
        }

    }

    @Transactional
    public void allocateChosenTasks() {
        List<Task> tasks = taskService.getUserTasks();
        for(Task task : tasks){
            timeIntervalService.allocateIntoSchedule(task);
        }
    }

    /*
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
*/

}

package com.arsenyvekshin.st_backend.controller;


import com.arsenyvekshin.st_backend.dto.TimeIntervalDto;
import com.arsenyvekshin.st_backend.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
@Tag(name = "Управление расписанием", description = "Методы для управления расписанием")
public class ScheduleController {

    private final ScheduleService scheduleService;

    @Operation(summary = "Получить расписание пользователя на день")
    @GetMapping("/{date}")
    public List<TimeIntervalDto> getScheduleForDay(@PathVariable("date") String date) {
        LocalDate localDate = LocalDate.parse(date); // Преобразуем строку в LocalDate
        return scheduleService.getScheduleForDay(localDate);
    }

    @Operation(summary = "Создать слоты рабочего дня на месяц вперед")
    @PostMapping("/workday")
    public void initWorkday(@RequestParam LocalTime dayStart, @RequestParam LocalTime dayEnd) {
        scheduleService.initWorkday(dayStart, dayEnd);
    }

    @Operation(summary = "Сформировать расписание на ближайшую неделю")
    @PostMapping("/generate")
    public void createScheduleForWeek() {

        //scheduleService.initWorkday(dayStart, dayEnd);
    }



}

package com.arsenyvekshin.st_backend.controller;


import com.arsenyvekshin.st_backend.dto.MessageInfoDto;
import com.arsenyvekshin.st_backend.dto.TimeIntervalDto;
import com.arsenyvekshin.st_backend.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
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
    public List<TimeIntervalDto> getScheduleForDay(
            @PathVariable("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return scheduleService.getScheduleForDay(date);
    }

    @Operation(summary = "Создать слоты рабочего дня на месяц вперед")
    @PostMapping("/workday")
    public void initWorkday(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime dayStart,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime dayEnd) {
        scheduleService.initWorkday(dayStart, dayEnd);
    }

    @Operation(summary = "Сформировать расписание на ближайшую неделю")
    @PostMapping("/generate")
    public void createScheduleForWeek() {

    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public MessageInfoDto error(Exception ex) {
        return new MessageInfoDto(ex.getMessage());
    }




}

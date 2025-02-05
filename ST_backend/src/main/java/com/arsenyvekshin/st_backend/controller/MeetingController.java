package com.arsenyvekshin.st_backend.controller;

import com.arsenyvekshin.st_backend.dto.MeetingDto;
import com.arsenyvekshin.st_backend.dto.MessageInfoDto;
import com.arsenyvekshin.st_backend.dto.PlaceDto;
import com.arsenyvekshin.st_backend.dto.TaskDto;
import com.arsenyvekshin.st_backend.service.MeetingService;
import com.arsenyvekshin.st_backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/meetings")
@RequiredArgsConstructor
@Tag(name = "Управление встречами", description = "Методы для управления встречами")
public class MeetingController {
    private final MeetingService meetingService;

    @Operation(summary = "Запрос встречи по id")
    @GetMapping("/{id}")
    public MeetingDto getMeeting(@PathVariable Long id){
        return new MeetingDto(meetingService.find(id));
    }

    @Operation(summary = "Создание встречи", description = "Создает встречу с указанными параметрами, и местом встречи по умолчанию онлайн (place.name=link)")
    @PostMapping("/new")
    public MeetingDto createBoards(@RequestBody @Valid MeetingDto meetingDto){
        return new MeetingDto(meetingService.create(meetingDto));
    }

    @Operation(summary = "Поиск доступного места для встречи")
    @PostMapping ("/{id}/find-place")
    public List<PlaceDto> getSuitablePlaces(@PathVariable Long id) {
        return meetingService.getSuitablePlacesForMeeting(id);
    }

    @Operation(summary = "Изменение встречи")
    @PutMapping("/{id}")
    public MeetingDto updateMeeting(@RequestBody @Valid MeetingDto meetingDto){
        return new MeetingDto(meetingService.update(meetingDto));
    }

    @Operation(summary = "Удаление задачи")
    @DeleteMapping("/{id}")
    public MessageInfoDto deleteMeeting(@PathVariable Long id){
        meetingService.delete(id);
        return new MessageInfoDto("OK");
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public MessageInfoDto error(Exception ex) {
        return new MessageInfoDto(ex.getMessage());
    }

}
package com.arsenyvekshin.st_backend.controller;

import com.arsenyvekshin.st_backend.dto.MessageInfoDto;
import com.arsenyvekshin.st_backend.dto.PlaceDto;
import com.arsenyvekshin.st_backend.dto.TimeIntervalDto;
import com.arsenyvekshin.st_backend.service.PlaceService;
import com.arsenyvekshin.st_backend.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/place")
@RequiredArgsConstructor
@Tag(name = "Управление местами", description = "Методы для управления помещениями для встреч")
public class PlaceController {

    private final PlaceService placeService;

    @Operation(summary = "Получить список всех помещений")
    @GetMapping("/list")
    public List<PlaceDto> getPlacesList() {
        return placeService.getAllPlaces();
    }

    @Operation(summary = "Создать помещение")
    @PostMapping("")
    public void createPlace(@RequestBody PlaceDto dto) {
        placeService.create(dto);
    }

    @Operation(summary = "Редактировать помещение")
    @PutMapping("")
    public void updatePlace(@RequestBody PlaceDto dto) {
        placeService.update(dto);
    }

    @Operation(summary = "Удаление задачи")
    @DeleteMapping("/{id}")
    public void deletePlace(@PathVariable Long id){
        placeService.delete(id);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public MessageInfoDto error(Exception ex) {
        return new MessageInfoDto(ex.getMessage());
    }

}

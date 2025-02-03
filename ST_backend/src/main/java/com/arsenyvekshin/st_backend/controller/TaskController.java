package com.arsenyvekshin.st_backend.controller;


import com.arsenyvekshin.st_backend.dto.TaskDto;
import com.arsenyvekshin.st_backend.dto.MessageInfoDto;
import com.arsenyvekshin.st_backend.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/kanban/tasks")
@RequiredArgsConstructor
@Tag(name = "Управление задачами", description = "Методы для работы ТОЛЬКО с задачами")
public class TaskController {

    private final TaskService taskService;

    @Operation(summary = "Запрос задачи по id")
    @GetMapping("/{id}")
    public TaskDto getTask(@PathVariable Long id){
        return taskService.getTask(id);
    }

    @Operation(summary = "Создание задачи")
    @PostMapping("")
    public TaskDto createBoards(@RequestBody @Valid TaskDto taskDto){
        return new TaskDto(taskService.create(taskDto));
    }

    @Operation(summary = "Изменение задачи")
    @PutMapping("")
    public TaskDto updateBoards(@RequestBody @Valid TaskDto taskDto){
        return new TaskDto(taskService.update(taskDto));
    }

    @Operation(summary = "Удаление задачи")
    @DeleteMapping("/{taskId}")
    public MessageInfoDto deleteBoards(@PathVariable Long taskId){
        taskService.delete(taskId);
        return new MessageInfoDto("OK");
    }
}

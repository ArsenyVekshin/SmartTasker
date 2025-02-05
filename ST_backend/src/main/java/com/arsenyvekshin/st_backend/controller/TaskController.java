package com.arsenyvekshin.st_backend.controller;


import com.arsenyvekshin.st_backend.dto.TaskDto;
import com.arsenyvekshin.st_backend.dto.MessageInfoDto;
import com.arsenyvekshin.st_backend.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/kanban/tasks")
@RequiredArgsConstructor
@Tag(name = "Управление задачами", description = "Методы для работы с задачами")
public class TaskController {

    private final TaskService taskService;

    @Operation(summary = "Запрос задачи по id")
    @GetMapping("/{id}")
    public TaskDto getTask(@PathVariable Long id){
        return taskService.getTask(id);
    }

    @Operation(summary = "Создание задачи")
    @PostMapping("")
    public TaskDto createTask(@RequestBody @Valid TaskDto taskDto){
        return new TaskDto(taskService.create(taskDto));
    }

    @Operation(summary = "Изменение задачи")
    @PutMapping("")
    public TaskDto updateTask(@RequestBody @Valid TaskDto taskDto){
        return new TaskDto(taskService.update(taskDto));
    }

    @Operation(summary = "Удаление задачи")
    @DeleteMapping("/{taskId}")
    public MessageInfoDto deleteTask(@PathVariable Long taskId){
        taskService.delete(taskId);
        return new MessageInfoDto("OK");
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public MessageInfoDto error(Exception ex) {
        return new MessageInfoDto(ex.getMessage());
    }

}

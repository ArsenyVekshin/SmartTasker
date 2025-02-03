package com.arsenyvekshin.st_backend.controller;


import com.arsenyvekshin.st_backend.dto.BoardContentDto;
import com.arsenyvekshin.st_backend.dto.BoardDto;
import com.arsenyvekshin.st_backend.dto.MessageInfoDto;
import com.arsenyvekshin.st_backend.entity.Board;
import com.arsenyvekshin.st_backend.service.BoardService;
import com.arsenyvekshin.st_backend.service.KanbanService;
import com.arsenyvekshin.st_backend.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kanba33n")
@RequiredArgsConstructor
@Tag(name = "Управление доской kanban", description = "Методы для работы с доской")
public class KanbanController {

    private final KanbanService kanbanService;
    private final BoardService boardService;
    private final TaskService taskService;






    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public MessageInfoDto error(Exception ex) {
        return new MessageInfoDto(ex.getMessage());
    }
}

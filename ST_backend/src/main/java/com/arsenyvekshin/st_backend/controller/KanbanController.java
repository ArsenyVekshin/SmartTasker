package com.arsenyvekshin.st_backend.controller;


import com.arsenyvekshin.st_backend.dto.BoardContentDto;
import com.arsenyvekshin.st_backend.dto.MessageInfoDto;
import com.arsenyvekshin.st_backend.entity.Board;
import com.arsenyvekshin.st_backend.service.KanbanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/kanban")
@RequiredArgsConstructor
@Tag(name = "Управление доской kanban", description = "Методы для работы с доской")
public class KanbanController {

    private final KanbanService kanbanService;

    @Operation(summary = "Запрос всех досок принадлежащих пользователю")
    @GetMapping("/board/own/all")
    public List<Board> getOwnedBoards() {
        return kanbanService.getOwnedBoards();
    }

    @Operation(summary = "Запрос всех задач принадлежащих доске")
    @GetMapping("/board/contain")
    public BoardContentDto getBoardContain(@RequestParam("board_id") Long board_id) {
        return kanbanService.getBoardTasks(board_id);
    }

    @Operation(summary = "Запрос всех досок с задачами пользователя")
    @GetMapping("/board/my/all")
    public List<BoardContentDto> getMyBoards() {
        return kanbanService.getMyBoards();
    }


    @Operation(summary = "Запрос всех задач этого пользователя, принадлежащих доске")
    @GetMapping("/board/my/contain")
    public BoardContentDto getMyBoards(@RequestParam("board_id") Long board_id) {
        return kanbanService.getMyTasksFromBoard(board_id);
    }


    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public MessageInfoDto error(Exception ex) {
        return new MessageInfoDto(ex.getMessage());
    }
}

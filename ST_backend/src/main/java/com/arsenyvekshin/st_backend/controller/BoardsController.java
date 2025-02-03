package com.arsenyvekshin.st_backend.controller;

import com.arsenyvekshin.st_backend.dto.BoardContentDto;
import com.arsenyvekshin.st_backend.dto.BoardDto;
import com.arsenyvekshin.st_backend.dto.MessageInfoDto;
import com.arsenyvekshin.st_backend.entity.Board;
import com.arsenyvekshin.st_backend.service.BoardService;
import com.arsenyvekshin.st_backend.service.KanbanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kanban/boards")
@RequiredArgsConstructor
@Tag(name = "Управление досками", description = "Методы для работы с досками")
public class BoardsController {

    private final KanbanService kanbanService;
    private final BoardService boardService;

    @Operation(summary = "Запрос всех досок принадлежащих пользователю")
    @GetMapping("/owned")
    public List<Board> getOwnedBoards() {
        return kanbanService.getOwnedBoards();
    }

    @Operation(summary = "Запрос всех досок с задачами пользователя")
    @GetMapping("/my")
    public List<BoardContentDto> getMyBoards() {
        return kanbanService.getMyBoards();
    }


    @Operation(summary = "Запрос всех задач принадлежащих доске")
    @GetMapping("/{boardId}/tasks")
    public BoardContentDto getBoardContain(@PathVariable Long boardId) {
        return kanbanService.getBoardTasks(boardId);
    }

    @Operation(summary = "Запрос всех задач этого пользователя, принадлежащих доске")
    @GetMapping("/{boardId}/tasks/my")
    public BoardContentDto getMyBoards(@PathVariable Long boardId) {
        return kanbanService.getMyTasksFromBoard(boardId);
    }

    @Operation(summary = "Создание доски")
    @PostMapping("")
    public BoardDto createBoard(@RequestBody @Valid BoardDto boardDto){
        return new BoardDto(boardService.create(boardDto));
    }

    @Operation(summary = "Изменение доски")
    @PutMapping("")
    public BoardDto updateBoard(@RequestBody @Valid BoardDto boardDto){
        return new BoardDto(boardService.update(boardDto));
    }

    @Operation(summary = "Удаление доски")
    @DeleteMapping("/{boardId}")
    public MessageInfoDto deleteBoard(@PathVariable Long boardId){
        boardService.delete(boardId);
        return new MessageInfoDto("OK");
    }
}

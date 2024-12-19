package com.arsenyvekshin.st_backend.service;

import com.arsenyvekshin.st_backend.dto.BoardContentDto;
import com.arsenyvekshin.st_backend.dto.TaskDto;
import com.arsenyvekshin.st_backend.entity.Board;
import com.arsenyvekshin.st_backend.entity.Task;
import com.arsenyvekshin.st_backend.entity.TaskStatus;
import com.arsenyvekshin.st_backend.entity.User;
import com.arsenyvekshin.st_backend.repository.BoardRepository;
import com.arsenyvekshin.st_backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KanbanService {

    private final BoardRepository boardRepository;
    private final TaskRepository taskRepository;

    private final UserService userService;


    public List<Board> getOwnedBoards() {
        User user = userService.getCurrentUser();
        return boardRepository.getBoardsByOwner(user);
    }

    public List<Task> getBoardTasks(Long boardId) {
        return taskRepository.findByBoardId(boardId);
    }


    public List<BoardContentDto> getMyBoards() {
        User user = userService.getCurrentUser();
        return taskRepository.findBoardsByUser(user).stream().map(this::getMyTasksFromBoard).toList();
    }

    public BoardContentDto getMyTasksFromBoard(Board board) {
        User user = userService.getCurrentUser();
        List<TaskDto> tasks = taskRepository.findTasksByBoardAndOwner(board, user).stream()
                .map(TaskDto::new)
                .collect(Collectors.toList());

        return new BoardContentDto(board.getId(), tasks);
    }

    public List<BoardContentDto> getTasksWithStatus(TaskStatus taskStatus) {
        return boardRepository.findAll().stream()
                .map(board -> {
                    List<TaskDto> tasks = taskRepository.findByBoardIdAndStatus(board.getId(), taskStatus)
                            .stream()
                            .map(TaskDto::new)
                            .collect(Collectors.toList());
                    return tasks.isEmpty() ? null : new BoardContentDto(board.getId(), tasks);
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

}
package com.arsenyvekshin.st_backend.service;


import com.arsenyvekshin.st_backend.dto.TaskDto;
import com.arsenyvekshin.st_backend.entity.Task;
import com.arsenyvekshin.st_backend.entity.User;
import com.arsenyvekshin.st_backend.repository.BoardRepository;
import com.arsenyvekshin.st_backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final BoardRepository boardRepository;
    private final TaskRepository taskRepository;

    private final UserService userService;

    public Task findTask(Long task_id){
        try {
            Optional<Task> task =  taskRepository.findById(task_id);
            if (task.isPresent()) return task.get();
            else
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}

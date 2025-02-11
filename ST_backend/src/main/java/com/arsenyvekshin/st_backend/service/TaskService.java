package com.arsenyvekshin.st_backend.service;


import com.arsenyvekshin.st_backend.dto.TaskDto;
import com.arsenyvekshin.st_backend.entity.Role;
import com.arsenyvekshin.st_backend.entity.Task;
import com.arsenyvekshin.st_backend.entity.TaskStatus;
import com.arsenyvekshin.st_backend.entity.User;
import com.arsenyvekshin.st_backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.awt.desktop.PreferencesEvent;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    private final UserService userService;
    private final BoardService boardService;
    private final KeypointService keypointService;


    public Task create(TaskDto dto) {
        Task task = new Task();
        taskRepository.save(build(task, dto));
        return task;
    }

    public Task find(Long id) {
        try {
            Optional<Task> task = taskRepository.findById(id);
            if (task.isPresent()) return task.get();
            else throw new IllegalArgumentException("Задача не найдена");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Task update(TaskDto dto) {
        Task task = find(dto.getId());
        userService.checkOwnership(task);
        taskRepository.save(build(task, dto));
        return task;
    }

    public void delete(Long id) {
        Task task = find(id);
        userService.checkOwnership(task);
        taskRepository.delete(task);
    }

    public void occupyTask(Task task) {
        task.setOwner(userService.getCurrentUser());
        task.setStatus(TaskStatus.OCCUPIED);
        taskRepository.save(task);
    }

    public void planTask(Task task) {
        task.setOwner(userService.getCurrentUser());
        task.setStatus(TaskStatus.INPROGRESS);
        taskRepository.save(task);
    }


    private Task build(Task task, TaskDto dto) {
        task.updateByDto(dto);

        if (dto.getBoard() != null) {
            if (dto.getBoard().getId() != null) {
                task.setBoard(boardService.find(dto.getBoard().getId()));
            } else {
                task.setBoard(boardService.create(dto.getBoard()));
            }
        }

        if (dto.getKeypoint() != null) {
            if (dto.getKeypoint().getId() != null) {
                task.setKeypoint(keypointService.find(dto.getKeypoint().getId()));
            } else {
                task.setKeypoint(keypointService.create(dto.getKeypoint()));
            }
        }

        if (dto.getOwner() != null) {
            User user = userService.getByUsername(dto.getOwner());
            if(user == null) task.setOwner(userService.getCurrentUser());
            else task.setOwner(user);
        } else {
            task.setOwner(userService.getCurrentUser());
        }


        return task;
    }

    public TaskDto getTask(Long id){
        Task task = find(id);
        userService.checkOwnership(task);
        return new TaskDto(task);
    }


    public List<Task> getUserTasks() {
        User user = userService.getCurrentUser();
        return taskRepository.findTasksToEmplace(user);
    }

}

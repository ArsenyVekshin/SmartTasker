package com.arsenyvekshin.st_backend.dto;

import com.arsenyvekshin.st_backend.entity.Task;
import com.arsenyvekshin.st_backend.entity.TaskStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.Duration;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
@Setter
@Getter
public class TaskDto {

    @JsonProperty
    private Long id;

    @JsonProperty
    private BoardDto board;

    @JsonProperty
    private String owner;

    @NotBlank(message = "Имя задачи не может быть пустым")
    @JsonProperty
    private String name;

    @JsonProperty
    private String description;

    @JsonProperty
    private long duration;

    @NotBlank(message = "Время начала задачи не может быть пустым")
    @JsonProperty
    private LocalDateTime start;

    @NotBlank(message = "Дедлайн задачи не может быть пустым")
    @JsonProperty
    private LocalDateTime finish;

    @JsonProperty
    private long repeatPeriod; // в минутах

    @JsonProperty
    private KeypointDto keypoint;

    @JsonProperty
    private TaskStatus status = TaskStatus.FREE;

    public TaskDto(Task task) {
        this.id = task.getId();
        this.board = new BoardDto(task.getBoard());
        this.owner = task.getOwner().getUsername();
        this.name = task.getName();
        this.description = task.getDescription();
        this.duration = task.getDuration().toMinutes();
        this.start = task.getStart();
        this.finish = task.getFinish();
        this.repeatPeriod = task.getRepeatPeriod().toMinutes();
        if(task.getKeypoint() != null) this.keypoint = new KeypointDto(task.getKeypoint());
        this.status = task.getStatus();
    }

}

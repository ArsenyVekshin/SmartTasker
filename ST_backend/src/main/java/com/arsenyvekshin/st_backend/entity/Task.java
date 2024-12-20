package com.arsenyvekshin.st_backend.entity;


import com.arsenyvekshin.st_backend.dto.TaskDto;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "Task")
public class Task implements OwnedObject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id", nullable = false)
    private Board board;

    @NotBlank(message = "Имя задачи не может быть пустым")
    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "duration")
    private Duration duration;

    @NotBlank(message = "Время начала задачи не может быть пустым")
    @Column(name = "start", nullable = false)
    private LocalDateTime start;

    @NotBlank(message = "Дедлайн задачи не может быть пустым")
    @Column(name = "finish", nullable = false)
    private LocalDateTime finish;

    @Column(name = "repeat_period")
    private Duration repeatPeriod;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "keypoint_id", nullable = true)
    private Keypoint keypoint;

    @Column(name = "status")
    private TaskStatus status = TaskStatus.FREE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = true)
    private User owner;


    public Task updateByDto(TaskDto dto) {
        this.name = dto.getName();
        this.description = dto.getDescription();
        this.duration = dto.getDuration();
        this.start = dto.getStart();
        this.finish = dto.getFinish();
        this.repeatPeriod = dto.getRepeatPeriod();
        this.status = dto.getStatus();
        return this;
    }

}

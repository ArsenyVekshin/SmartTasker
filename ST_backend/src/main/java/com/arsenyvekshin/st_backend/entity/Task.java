package com.arsenyvekshin.st_backend.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "Task")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
    @Column(name = "started", nullable = false)
    private LocalDateTime started;

    @NotBlank(message = "Дедлайн задачи не может быть пустым")
    @Column(name = "deadline", nullable = false)
    private LocalDateTime deadline;

    @Column(name = "repeatPeriod")
    private Duration repeatPeriod;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "keypoint_id", nullable = true)
    private Keypoint keypoint;

    @Column(name = "status")
    private TaskStatus status = TaskStatus.FREE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = true)
    private User owner;

}

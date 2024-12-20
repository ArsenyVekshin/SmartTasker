package com.arsenyvekshin.st_backend.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "TimeInterval")
public class TimeInterval implements OwnedObject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = true)
    private Task task;

    @ManyToOne()
    @JoinColumn(name = "meeting_id")
    private Meeting meeting;

    @ManyToOne()
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;

    @Column(name = "duration")
    @Min(value = 600, message = "Перекур дольше длится, камон... Давай хотя-бы 10 минут")
    @Max(value = 28800, message = "Ты можешь столько работать подряд, серьезно? (8 - максимум, не ври себе)")
    private Duration duration;

    @NotBlank(message = "Время начала интервала не может быть пустым")
    @Column(name = "start", nullable = false)
    private LocalDateTime start;

    @NotBlank(message = "Время окончания интервала не может быть пустым")
    @Column(name = "finish", nullable = false)
    private LocalDateTime finish;

    @Column(name = "locked")
    private boolean locked = false;


    public TimeInterval(User owner, LocalDateTime start, LocalDateTime finish) {
        this.owner = owner;
        this.start = start;
        this.finish = finish;
    }

    @AssertTrue(message = "Время начала не может быть в прошлом")
    public boolean isBeginValid() {
        return start.isAfter(LocalDateTime.now());
    }

    @PrePersist
    protected void onCreate() {
        this.duration = Duration.between(this.start, this.finish);
        //TODO: нужна валидация? Проверить
    }

}

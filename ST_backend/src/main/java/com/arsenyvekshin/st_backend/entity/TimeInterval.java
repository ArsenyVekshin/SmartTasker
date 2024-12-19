package com.arsenyvekshin.st_backend.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.Duration;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
@NoArgsConstructor
@Entity(name = "TimeInterval")
public class TimeInterval {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = true)
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_id")
    private Meeting meeting;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "duration")
    @Min(value = 600, message = "Перекур дольше длится, камон... Давай хотя-бы 10 минут")
    @Max(value = 28800, message = "Ты можешь столько работать подряд, серьезно? (8 - максимум, не ври себе)")
    private Duration duration;

    @NotBlank(message = "Время начала интервала не может быть пустым")
    @Column(name = "begin", nullable = false)
    private LocalDateTime begin;

    @NotBlank(message = "Время окончания интервала не может быть пустым")
    @Column(name = "end", nullable = false)
    private LocalDateTime end;

    @Column(name = "locked")
    private boolean locked = false;


    @AssertTrue(message = "Время начала не может быть в прошлом")
    public boolean isBeginValid() {
        return begin.isAfter(LocalDateTime.now());
    }

    public TimeInterval(User user, LocalDateTime begin, LocalDateTime end) {
        this.user = user;
        this.begin = begin;
        this.end = end;
    }

    @PrePersist
    protected void onCreate() {
        this.duration = Duration.between(this.begin, this.end);
        //TODO: нужна валидация? Проверить
    }

}

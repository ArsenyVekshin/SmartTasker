package com.arsenyvekshin.st_backend.entity;


import com.sun.jdi.request.DuplicateRequestException;
import jakarta.persistence.*;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.InvalidClassException;
import java.time.Duration;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "time_interval")
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
    @Min(value = 10, message = "Перекур дольше длится, камон... Давай хотя-бы 10 минут")
    @Max(value = 600, message = "Ты можешь столько работать подряд, серьезно? (8 - максимум, не ври себе)")
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

    public void occupyBy(AllocatableObject obj) {
        if(obj.getClass() == Task.class)
            this.task = (Task) obj;
        else if(obj.getClass() == Meeting.class)
            this.meeting = (Meeting) obj;
        else throw new IllegalArgumentException("Данный клас не может резервировать временные слоты");
    }


    public boolean isCapableFor(AllocatableObject placeholder) {
        return  !this.locked
                && this.meeting == null
                && this.task == null;
    }

    public boolean isCapableForStable(AllocatableObject placeholder) {
        return  !this.locked
                && this.meeting == null
                && this.task == null
                && (this.start.isBefore(placeholder.getStart()) || this.start.isEqual(placeholder.getStart()))
                && (this.finish.isAfter(placeholder.getFinish()) || this.finish.isEqual(placeholder.getFinish())) ;
    }

    public boolean isPossibleToSplit(Duration part) {
        return this.duration.minus(part).compareTo(Duration.ofMinutes(10)) > 0;
    }
}

package com.arsenyvekshin.st_backend.dto;

import com.arsenyvekshin.st_backend.entity.TimeInterval;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.PrePersist;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TimeIntervalDto {

    @JsonProperty
    private Long id;

    @JsonProperty
    private Long taskId;

    @JsonProperty
    private Long meeting_id;

    @JsonProperty
    private String owner;

    @JsonProperty
    @Min(value = 600, message = "Перекур дольше длится, камон... Давай хотя-бы 10 минут")
    @Max(value = 28800, message = "Ты можешь столько работать подряд, серьезно? (8 - максимум, не ври себе)")
    private Duration duration;

    @JsonProperty
    @NotNull(message = "Время начала интервала не может быть пустым")
    private LocalDateTime start;

    @JsonProperty
    @NotNull(message = "Время окончания интервала не может быть пустым")
    private LocalDateTime finish;

    public TimeIntervalDto(TimeInterval interval) {
        this.id = interval.getId();
        this.taskId = interval.getTask().getId();
        this.meeting_id = interval.getMeeting().getId();
        this.owner = interval.getOwner().getUsername();
        this.duration = interval.getDuration();
        this.start = interval.getStart();
        this.finish = interval.getFinish();
    }

    @PrePersist
    protected void onCreate() {
        this.duration = Duration.between(this.start, this.finish);
        //TODO: нужна валидация? Проверить
    }
}

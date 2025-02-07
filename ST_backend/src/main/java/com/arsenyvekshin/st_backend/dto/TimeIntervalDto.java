package com.arsenyvekshin.st_backend.dto;

import com.arsenyvekshin.st_backend.entity.TimeInterval;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.PrePersist;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.Duration;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
@Setter
@Getter
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
    @Min(value = 10, message = "Перекур дольше длится, камон... Давай хотя-бы 10 минут")
    @Max(value = 600, message = "Ты можешь столько работать подряд, серьезно? (8 - максимум, не ври себе)")
    private long duration; // длительность в минутах

    @JsonProperty
    @NotNull(message = "Время начала интервала не может быть пустым")
    private LocalDateTime start;

    @JsonProperty
    @NotNull(message = "Время окончания интервала не может быть пустым")
    private LocalDateTime finish;

    public TimeIntervalDto(TimeInterval interval) {
        this.id = interval.getId();
        if(interval.getTask() != null)
            this.taskId = interval.getTask().getId();
        if(interval.getMeeting() != null)
            this.meeting_id = interval.getMeeting().getId();
        this.owner = interval.getOwner().getUsername();
        this.duration = interval.getDuration().toMinutes();
        this.start = interval.getStart();
        this.finish = interval.getFinish();
    }

    @PrePersist
    protected void onCreate() {
        this.duration = Duration.between(this.start, this.finish).toMinutes();
        //TODO: нужна валидация? Проверить
    }
}

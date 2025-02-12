package com.arsenyvekshin.st_backend.dto;


import com.arsenyvekshin.st_backend.entity.Meeting;
import com.arsenyvekshin.st_backend.entity.User;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@RequiredArgsConstructor
@Setter
@Getter
public class MeetingDto {

    @JsonProperty
    private Long id;

    @NotBlank(message = "Имя встречи не может быть пустым")
    @JsonProperty
    private String name;

    @JsonProperty
    private String description;

    @JsonProperty
    private long duration;

    @NotBlank(message = "Время начала задачи не может быть пустым")
    @JsonProperty
    private LocalDateTime begin;

    @NotBlank(message = "Дедлайн задачи не может быть пустым")
    @JsonProperty
    private LocalDateTime end;

    @JsonProperty
    private long repeatPeriod;

    @JsonProperty
    private KeypointDto keypoint;

    @JsonProperty
    private PlaceDto place;

    @JsonProperty
    private String owner;

    private List<String> members = new ArrayList<>();


    public MeetingDto(Meeting obj) {
        this.id = obj.getId();
        this.name = obj.getName();
        this.description = obj.getDescription();
        this.duration = obj.getDuration().toMinutes();
        this.begin = obj.getStart();
        this.end = obj.getFinish();
        this.repeatPeriod = obj.getRepeatPeriod().toMinutes();
        if (obj.getKeypoint() != null)
            this.keypoint = new KeypointDto(obj.getKeypoint());
        if (obj.getPlace() != null)
            this.place = new PlaceDto(obj.getPlace());
        if (obj.getOwner() != null)
            this.owner = obj.getOwner().getUsername();

        if(!obj.getMembers().isEmpty()) {
            this.members.addAll(obj.getMembers().stream().map(User::getUsername).toList());
        }
    }


}

package com.arsenyvekshin.st_backend.dto;

import com.arsenyvekshin.st_backend.entity.Keypoint;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
@Setter
@Getter
public class KeypointDto {

    @JsonProperty
    private Long id;

    @JsonProperty
    private String name;

    @JsonProperty
    private String description;

    @JsonProperty
    private java.time.LocalDateTime timestamp;

    public KeypointDto(Keypoint obj) {
        this.id = obj.getId();
        this.name = obj.getName();
        this.description = obj.getDescription();
        this.timestamp = obj.getTimestamp();
    }
}

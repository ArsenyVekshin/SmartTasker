package com.arsenyvekshin.st_backend.dto;

import com.arsenyvekshin.st_backend.entity.Place;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PlaceDto {

    @JsonProperty
    private Long id;

    @NotBlank(message = "Имя не может быть пустым")
    @JsonProperty
    private String name;

    @NotBlank(message = "Вместимость не может быть пустым")
    @JsonProperty
    private int capacity;

    @JsonProperty
    private boolean available = true;

    public PlaceDto(Place obj) {
        this.id = obj.getId();
        this.name = obj.getName();
        this.capacity = obj.getCapacity();
        this.available = obj.isAvailable();
    }
}

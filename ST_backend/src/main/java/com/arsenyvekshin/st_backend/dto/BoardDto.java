package com.arsenyvekshin.st_backend.dto;


import com.arsenyvekshin.st_backend.entity.Board;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BoardDto {

    @JsonProperty
    private Long id;

    @NotBlank(message = "Имя не может быть пустым")
    @JsonProperty
    private String name;

    @JsonProperty
    private String owner;

    public BoardDto(Board board) {
        this.id = board.getId();
        this.name = board.getName();
        this.owner = board.getOwner().getUsername();
    }

}

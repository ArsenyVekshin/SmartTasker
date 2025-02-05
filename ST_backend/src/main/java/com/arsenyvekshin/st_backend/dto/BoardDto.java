package com.arsenyvekshin.st_backend.dto;


import com.arsenyvekshin.st_backend.entity.Board;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
@Setter
@Getter
public class BoardDto {

    private Long id;

    @NotBlank(message = "Имя не может быть пустым")
    private String name;

    private String owner;

    public BoardDto(Board board) {
        this.id = board.getId();
        this.name = board.getName();
        this.owner = board.getOwner().getUsername();
    }

}

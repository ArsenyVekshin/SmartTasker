package com.arsenyvekshin.st_backend.dto;


import com.arsenyvekshin.st_backend.entity.Board;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class BoardContentDto {

    @JsonProperty
    private Long board_id;


    @JsonProperty
    List<TaskDto> list = new ArrayList<>();

    public BoardContentDto(Long board_id) {
        this.board_id = board_id;
    }

    public BoardContentDto(Board board) {
        this.board_id = board.getId();
    }

    public void addTask(TaskDto task) {
        list.add(task);
    }



}

package com.arsenyvekshin.st_backend.entity;


import com.arsenyvekshin.st_backend.dto.BoardDto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@Entity(name = "Board")
public class Board implements OwnedObject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner")
    private User owner;

    public Board updateByDto(BoardDto dto) {
        this.name = dto.getName();
        return this;
    }

}


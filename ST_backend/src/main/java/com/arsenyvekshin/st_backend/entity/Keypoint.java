package com.arsenyvekshin.st_backend.entity;

import com.arsenyvekshin.st_backend.dto.KeypointDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "Keypoint")
public class Keypoint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "timestamp")
    private java.time.LocalDateTime timestamp;

    public Keypoint updateByDto(KeypointDto dto) {
        this.name = dto.getName();
        this.description = dto.getDescription();
        this.timestamp = dto.getTimestamp();
        return this;
    }

    public boolean isExpired() {
        return timestamp.isBefore(LocalDateTime.now());
    }
}

package com.arsenyvekshin.st_backend.entity;

import jakarta.persistence.*;
import lombok.*;



@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "Board")
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
}

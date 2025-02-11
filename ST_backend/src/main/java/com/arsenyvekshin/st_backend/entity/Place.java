package com.arsenyvekshin.st_backend.entity;


import com.arsenyvekshin.st_backend.dto.PlaceDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "Place")
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "address", nullable = false, length = 255)
    private String address;

    @Column(name = "capacity", nullable = false)
    private int capacity;

    @Column(name = "available")
    private boolean available;

    public Place updateByDto(PlaceDto dto) {
        this.name = dto.getName();
        this.capacity = dto.getCapacity();
        this.available = dto.isAvailable();
        this.address = dto.getAddress();
        return this;
    }
}

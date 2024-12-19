package com.arsenyvekshin.st_backend.repository;

import com.arsenyvekshin.st_backend.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {
    // Метод для поиска места по его имени
    List<Place> findByName(String name);

    // Метод для поиска места по адресу
    List<Place> findByAddress(String address);

    // Метод для поиска доступных мест
    List<Place> findByAvailableTrue();

    // Метод для поиска мест по вместимости
    List<Place> findByCapacityGreaterThanEqual(int capacity);

    // Метод для поиска мест по доступности и вместимости
    List<Place> findByAvailableTrueAndCapacityGreaterThanEqual(int capacity);
}

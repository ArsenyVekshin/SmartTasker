package com.arsenyvekshin.st_backend.service;


import com.arsenyvekshin.st_backend.dto.PlaceDto;
import com.arsenyvekshin.st_backend.entity.Place;
import com.arsenyvekshin.st_backend.repository.PlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PlaceService {
    private final PlaceRepository placeRepository;


    public Place create(PlaceDto dto) {
        Place obj = new Place().updateByDto(dto);
        placeRepository.save(obj);
        return obj;
    }

    public Place find(Long id) {
        try {
            Optional<Place> keypoint = placeRepository.findById(id);
            if (keypoint.isPresent()) return keypoint.get();
            else throw new IllegalArgumentException("Локация не найдена");
        } catch (Exception e) {
            throw new InternalError(e);
        }
    }

    public Place update(PlaceDto dto) {
        Place obj = find(dto.getId());
        placeRepository.save(obj.updateByDto(dto));
        return obj;
    }

    public void delete(Long id) {
        Place obj = find(id);
        placeRepository.delete(obj);
    }

}

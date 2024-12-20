package com.arsenyvekshin.st_backend.service;


import com.arsenyvekshin.st_backend.dto.KeypointDto;
import com.arsenyvekshin.st_backend.entity.Keypoint;
import com.arsenyvekshin.st_backend.repository.KeypointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class KeypointService {

    private final KeypointRepository keypointRepository;


    public Keypoint create(KeypointDto dto) {
        Keypoint obj = new Keypoint().updateByDto(dto);
        keypointRepository.save(obj);
        return obj;
    }

    public Keypoint find(Long id) {
        try {
            Optional<Keypoint> keypoint = keypointRepository.findById(id);
            if (keypoint.isPresent()) return keypoint.get();
            else throw new IllegalArgumentException("keypoint не найден");
        } catch (Exception e) {
            throw new InternalError(e);
        }
    }

    public Keypoint update(KeypointDto dto) {
        Keypoint obj = find(dto.getId());
        keypointRepository.save(obj.updateByDto(dto));
        return obj;
    }

    public void delete(Long id) {
        Keypoint obj = find(id);
        keypointRepository.delete(obj);
    }
}

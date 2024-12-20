package com.arsenyvekshin.st_backend.service;


import com.arsenyvekshin.st_backend.dto.MeetingDto;
import com.arsenyvekshin.st_backend.entity.Meeting;
import com.arsenyvekshin.st_backend.repository.MeetingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MeetingService {

    private final MeetingRepository meetingRepository;

    private final UserService userService;
    private final PlaceService placeService;
    private final KeypointService keypointService;


    public Meeting create(MeetingDto dto) {
        Meeting meeting = new Meeting();
        meetingRepository.save(build(meeting, dto));
        return meeting;
    }

    public Meeting find(Long id) {
        try {
            Optional<Meeting> meeting = meetingRepository.findById(id);
            if (meeting.isPresent()) return meeting.get();
            else throw new IllegalArgumentException("Встреча не найдена");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Meeting update(MeetingDto dto) {
        Meeting meeting = find(dto.getId());
        meetingRepository.save(build(meeting, dto));
        return meeting;
    }

    public void delete(Long id) {
        Meeting meeting = find(id);
        meetingRepository.delete(meeting);
    }


    private Meeting build(Meeting meeting, MeetingDto dto) {
        meeting.updateByDto(dto);

        if (dto.getKeypoint() != null) {
            if (dto.getKeypoint().getId() != null) {
                meeting.setKeypoint(keypointService.find(dto.getKeypoint().getId()));
            } else {
                meeting.setKeypoint(keypointService.create(dto.getKeypoint()));
            }
        }

        if (dto.getPlace() != null) {
            if (dto.getPlace().getId() != null) {
                meeting.setPlace(placeService.find(dto.getPlace().getId()));
            } else {
                meeting.setPlace(placeService.create(dto.getPlace()));
            }
        }

        return meeting;
    }


}

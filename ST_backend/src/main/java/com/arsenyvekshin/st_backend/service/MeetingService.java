package com.arsenyvekshin.st_backend.service;


import com.arsenyvekshin.st_backend.dto.MeetingDto;
import com.arsenyvekshin.st_backend.dto.PlaceDto;
import com.arsenyvekshin.st_backend.entity.Meeting;
import com.arsenyvekshin.st_backend.entity.Place;
import com.arsenyvekshin.st_backend.entity.User;
import com.arsenyvekshin.st_backend.repository.MeetingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
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

    public List<Place> findBusyPlacesByTimeRange(LocalDateTime start, LocalDateTime finish){
        return meetingRepository.findBusyPlacesByTimeRange(start, finish);
    }

    private List<Place> findSuitablePlacesForMeeting(Meeting meeting) {
        List<Place> suitable = placeService.findSuitablePlaces(meeting.membersNum());
        if(suitable.isEmpty()) throw new IllegalArgumentException("Слишком много участников. Нет подходящей локации.");
        List<Place> busy = findBusyPlacesByTimeRange(meeting.getStart(), meeting.getFinish());
        suitable.removeAll(busy);
        if(suitable.isEmpty()) throw new IllegalArgumentException("Все подходящие локации в это время заняты.");

        return suitable;
    }

    public List<PlaceDto> getSuitablePlacesForMeeting(long id) {
        Meeting meeting = find(id);
        return findSuitablePlacesForMeeting(meeting).stream().map(PlaceDto::new).toList();
    }

    public List<Meeting> getAllUserMeetings(User user) {
        return meetingRepository.findByMembersId(user.getId());
    }

}

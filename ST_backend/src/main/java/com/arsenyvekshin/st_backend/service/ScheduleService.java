package com.arsenyvekshin.st_backend.service;


import com.arsenyvekshin.st_backend.entity.Meeting;
import com.arsenyvekshin.st_backend.entity.Place;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ScheduleService {

   private final TimeIntervalService timeIntervalService;
    private final TaskService taskService;
    private final KanbanService kanbanService;
    private final MeetingService meetingService;
    private final PlaceService placeService;
    public void meow() {System.out.println("meow");}




}

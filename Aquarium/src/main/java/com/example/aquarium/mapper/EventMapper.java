package com.example.aquarium.mapper;

import com.example.aquarium.bean.request.EventRequest;
import com.example.aquarium.bean.response.EventResponse;
import com.example.aquarium.model.Event;
import com.example.aquarium.model.User;
import com.example.aquarium.service.ImgService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


@Component
public class EventMapper {
    @Value("${custom.date-format}")
    private String dateFormat;

    private ImgService imgService;


    public EventMapper(ImgService imgService) {
        this.imgService = imgService;
    }

    public LocalDateTime parseDate(String dateStr) throws IllegalArgumentException {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(dateFormat);
        try {
            return LocalDateTime.parse(dateStr, formatter);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid date format: " + dateStr, e);
        }
    }

    public Event toEntity(EventRequest eventRequest, User user) throws IOException {
        Event existingEvent = new Event();
        existingEvent.setEventName(eventRequest.getEventName());
        existingEvent.setDescription(eventRequest.getDescription());
        existingEvent.setStartDate(parseDate(eventRequest.getStartDate()));
        existingEvent.setEndDate(parseDate(eventRequest.getEndDate()));
        existingEvent.setUser(user);

        if (eventRequest.getImg() != null && !eventRequest.getImg().isEmpty()) {
            String imageName = imgService.saveImage(eventRequest.getImg());
            existingEvent.setImg(imageName);
        }

        return existingEvent;
    }



    public static EventResponse toResponse(Event event) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setEventName(event.getEventName());
        response.setDescription(event.getDescription());
        response.setStartDate(event.getStartDate());
        response.setEndDate(event.getEndDate());
        response.setImg(event.getImg());
        return response;
    }
}

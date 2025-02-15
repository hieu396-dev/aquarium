package com.example.aquarium.service;

import com.example.aquarium.bean.request.EventRequest;
import com.example.aquarium.bean.response.EventResponse;
import com.example.aquarium.exception.ResourceNotFoundException;
import com.example.aquarium.exception.UniqueConstraintViolationException;
import com.example.aquarium.mapper.EventMapper;
import com.example.aquarium.model.Event;
import com.example.aquarium.model.User;
import com.example.aquarium.repository.EventRepository;
import com.example.aquarium.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EventMapper eventMapper;
    private final ImgService imgService;

    public List<EventResponse> findAll() {
        return eventRepository.findAll().stream()
                .map(EventMapper::toResponse)
                .collect(Collectors.toList());
    }

    public Optional<EventResponse> findById(Integer id) {
        return eventRepository.findById(id)
                .map(EventMapper::toResponse);
    }

    public Event createEvent(EventRequest eventRequest) throws IOException {
        User user = userRepository.findById(eventRequest.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (eventRepository.existsByEventName(eventRequest.getEventName())) {
            throw new UniqueConstraintViolationException("eventName '" + eventRequest.getEventName() + "' already exists.");
        }
        Event event = eventMapper.toEntity(eventRequest, user);
        return eventRepository.save(event);
    }

    public void deleteById(Integer id) {
        eventRepository.deleteById(id);
    }

    public Event updateEvent(Integer id, EventRequest eventDetails) throws Exception {
        Event existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        existingEvent.setEventName(eventDetails.getEventName());
        existingEvent.setDescription(eventDetails.getDescription());

        if (eventDetails.getImg() != null && !eventDetails.getImg().isEmpty()) {
            String imgFilename = imgService.saveImage(eventDetails.getImg());
            existingEvent.setImg(imgFilename);
        }

        existingEvent.setStartDate(eventMapper.parseDate(eventDetails.getStartDate()));
        existingEvent.setEndDate(eventMapper.parseDate(eventDetails.getEndDate()));

        existingEvent.setUser(userRepository.findById(eventDetails.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + eventDetails.getUserId())));

        return eventRepository.save(existingEvent);
    }
}

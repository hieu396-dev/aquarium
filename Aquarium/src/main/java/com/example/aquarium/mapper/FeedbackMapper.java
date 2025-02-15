package com.example.aquarium.mapper;


import com.example.aquarium.bean.request.FeedbackRequest;
import com.example.aquarium.bean.response.FeedbackResponse;
import com.example.aquarium.model.Feedback;
import com.example.aquarium.model.User;
import com.example.aquarium.repository.TicketRepository;
import com.example.aquarium.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class FeedbackMapper {

    private final UserRepository userRepository;

    public Feedback toEntity(FeedbackRequest request) {
        Feedback feedback = new Feedback();
        feedback.setContent(request.getContent());
        Optional<User> u = userRepository.findById(request.getUserId());
        feedback.setUser(u.orElse(null));
        return feedback;
    }
    public static FeedbackResponse convertToResponse(Feedback feedback) {
        FeedbackResponse response = new FeedbackResponse();
        response.setContent(feedback.getContent());
        response.setDate(feedback.getDate());
        response.setFullName(feedback.getUser().getFirstName() + " " + feedback.getUser().getLastName());
        return response;
    }
}

package com.example.aquarium.service;

import com.example.aquarium.bean.request.FeedbackRequest;
import com.example.aquarium.bean.response.FeedbackResponse;
import com.example.aquarium.mapper.FeedbackMapper;
import com.example.aquarium.model.Feedback;
import com.example.aquarium.model.User;
import com.example.aquarium.repository.FeedbackRepository;
import com.example.aquarium.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final FeedbackMapper feedbackMapper;

    public FeedbackResponse addFeedback(FeedbackRequest feedbackRequest) {
        Feedback feedback = feedbackMapper.toEntity(feedbackRequest);
        Feedback savedFeedback = feedbackRepository.save(feedback);
        return feedbackMapper.convertToResponse(savedFeedback);
    }

    public List<FeedbackResponse> findAllFeedback() {
        return feedbackRepository.findAll().stream()
                .map(FeedbackMapper::convertToResponse)
                .collect(Collectors.toList());
    }
}
package com.example.aquarium.controller;

import com.example.aquarium.bean.request.FeedbackRequest;
import com.example.aquarium.bean.response.FeedbackResponse;
import com.example.aquarium.bean.response.MessageResponse;
import com.example.aquarium.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;
    @PostMapping
    public ResponseEntity<MessageResponse> addFeedback(@RequestBody FeedbackRequest feedback) {
        feedbackService.addFeedback(feedback);
        return new ResponseEntity<>(new MessageResponse("Successfully!"), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<FeedbackResponse>> getAllFeedbacks() {
        List<FeedbackResponse> feedbacks = feedbackService.findAllFeedback();
        return ResponseEntity.ok(feedbacks);
    }
}


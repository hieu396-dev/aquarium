package com.example.aquarium.controller;

import com.example.aquarium.bean.request.BuyRequest;
import com.example.aquarium.bean.response.MessageResponse;
import com.example.aquarium.service.BuyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/buy")
@RequiredArgsConstructor
public class BuyController {
    private final BuyService buyService;
    @PostMapping()
    public ResponseEntity<MessageResponse> buyTicket(@Valid @RequestBody BuyRequest buyRequest) {
        BuyRequest buyRequest1 = buyService.buyTicket(buyRequest);
        return new ResponseEntity<>(new MessageResponse("Successfully!"), HttpStatus.CREATED);
    }
}

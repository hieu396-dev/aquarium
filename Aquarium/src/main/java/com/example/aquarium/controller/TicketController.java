package com.example.aquarium.controller;

import com.example.aquarium.bean.response.TicketResponse;
import com.example.aquarium.security.interfaceRole.*;
import com.example.aquarium.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;


    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicket(@PathVariable Integer id) {
        TicketResponse response = ticketService.getTicket(id);
        return ResponseEntity.ok(response);
    }

    @AdminAndInvoiceAccess
    @GetMapping
    public ResponseEntity<List<TicketResponse>> getAllTickets() {
        List<TicketResponse> responses = ticketService.getAllTickets();
        return ResponseEntity.ok(responses);
    }

}


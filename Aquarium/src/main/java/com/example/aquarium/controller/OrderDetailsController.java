package com.example.aquarium.controller;

import com.example.aquarium.bean.response.OrderDetailsResponse;
import com.example.aquarium.security.interfaceRole.AdminAccess;
import com.example.aquarium.security.interfaceRole.AdminAndInvoiceAccess;
import com.example.aquarium.security.interfaceRole.InvoiceStaffAccess;
import com.example.aquarium.service.OrderDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-details")
@RequiredArgsConstructor
public class OrderDetailsController {

    private final OrderDetailsService orderDetailsService;

    @GetMapping
    @AdminAndInvoiceAccess
    public ResponseEntity<List<OrderDetailsResponse>> getAllOrderDetails() {
        List<OrderDetailsResponse> responses = orderDetailsService.getAllOrderDetails();
        return ResponseEntity.ok(responses);
    }
}


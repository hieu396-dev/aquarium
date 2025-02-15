package com.example.aquarium.controller;


import com.example.aquarium.bean.response.BuyResponse;
import com.example.aquarium.bean.response.ChartData;
import com.example.aquarium.bean.response.OrderResponse;
import com.example.aquarium.bean.response.BuyResponse;
import com.example.aquarium.model.TicketStatus;
import com.example.aquarium.security.interfaceRole.*;
import com.example.aquarium.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    @AdminAndInvoiceAccess
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Integer id) {
        return orderService.findById(id)
                .map(order -> new ResponseEntity<>(order, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    @AdminAndInvoiceAccess
    @GetMapping("/buy/{id}")
    public ResponseEntity<List<BuyResponse>> getOrderDetails(@PathVariable Integer id) {
        List<BuyResponse> responses = orderService.getOrderByOrderId(id);
        return ResponseEntity.ok(responses);
    }

    @AdminAndInvoiceAccess
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> responses = orderService.getAllOrders();
        return ResponseEntity.ok(responses);
    }
    @AdminInvoiceContentAccess
    @GetMapping("/overview")
    public List<ChartData> getOverviewData() {
        return orderService.getLastSixMonthsRevenue();
    }
    @AdminInvoiceContentAccess
    @GetMapping("/details")
    public List<ChartData> getDetailsData() {
        return orderService.getWeeklySalesData();
    }
    @AdminAndInvoiceAccess
    @PutMapping("/tickets/{orderDetailsId}/status")
    public ResponseEntity<Map<String, String>> updateTicketStatus(
            @PathVariable Integer orderDetailsId,
            @RequestBody String status) {

        Map<String, String> response = new HashMap<>();
        try {
            TicketStatus ticketStatus = TicketStatus.fromString(status);
            boolean updated = orderService.updateTicketStatus(orderDetailsId, ticketStatus);

            if (updated) {
                response.put("message", "Ticket statuses updated successfully.");
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "No tickets found for the given orderDetailsId.");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (IllegalArgumentException e) {
            response.put("message", "Invalid status: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("message", "An error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


}


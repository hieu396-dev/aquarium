package com.example.aquarium.mapper;

import com.example.aquarium.bean.response.OrderResponse;
import com.example.aquarium.exception.ResourceNotFoundException;
import com.example.aquarium.model.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderMapper {
    public OrderResponse toResponse(Order order) {
        if (order == null) {
            throw new ResourceNotFoundException("Order not found");
        }

        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setEmail(order.getUser() != null ? order.getUser().getEmail() : null);
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus());
        response.setPaymentMethod(order.getPaymentMethod().toString());
        response.setDiscount(order.getDiscount());
        response.setCreatedAt(order.getCreatedAt());

        return response;
    }
}

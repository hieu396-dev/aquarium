package com.example.aquarium.mapper;

import com.example.aquarium.bean.request.OrderDetailsRequest;
import com.example.aquarium.bean.response.OrderDetailsResponse;
import com.example.aquarium.exception.ResourceNotFoundException;
import com.example.aquarium.model.Order;
import com.example.aquarium.model.OrderDetails;
import com.example.aquarium.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderDetailsMapper {

    private final OrderRepository orderRepository;

    public OrderDetails toEntity(OrderDetailsRequest request) {
        OrderDetails orderDetail = new OrderDetails();

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + request.getOrderId()));

        orderDetail.setOrder(order);
        orderDetail.setPrice(request.getPrice());
        //orderDetail.setQuantity(request.getQuantity());

        return orderDetail;
    }

    public OrderDetailsResponse toResponse(OrderDetails orderDetail) {
        OrderDetailsResponse response = new OrderDetailsResponse();
        response.setOrderId(orderDetail.getOrder().getId());
        response.setPrice(orderDetail.getPrice());
        response.setQuantity(orderDetail.getQuantity());

        return response;
    }
}

package com.example.aquarium.service;

import com.example.aquarium.bean.request.OrderDetailsRequest;
import com.example.aquarium.bean.response.OrderDetailsResponse;
import com.example.aquarium.exception.ResourceNotFoundException;
import com.example.aquarium.mapper.OrderDetailsMapper;
import com.example.aquarium.model.OrderDetails;
import com.example.aquarium.repository.OrderDetailsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderDetailsService {

    private final OrderDetailsRepository orderDetailsRepository;

    private final OrderDetailsMapper orderDetailsMapper;

    public List<OrderDetailsResponse> getAllOrderDetails() {
        List<OrderDetails> orderDetails = orderDetailsRepository.findAll();
        return orderDetails.stream()
                .map(orderDetailsMapper::toResponse)
                .collect(Collectors.toList());
    }
}


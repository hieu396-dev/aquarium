package com.example.aquarium.service;

import com.example.aquarium.bean.request.UserRequest;
import com.example.aquarium.bean.response.BuyResponse;
import com.example.aquarium.bean.response.OrderResponse;
import com.example.aquarium.bean.response.MessageResponse;
import com.example.aquarium.bean.response.UserResponse;
import com.example.aquarium.exception.ResourceNotFoundException;
import com.example.aquarium.mapper.OrderMapper;
import com.example.aquarium.mapper.UserMapper;
import com.example.aquarium.model.*;
import com.example.aquarium.repository.LoyaltyPointsRepository;
import com.example.aquarium.repository.OrderRepository;
import com.example.aquarium.repository.RoleRepository;
import com.example.aquarium.repository.UserRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {


    private final UserRepository userRepository;

    private final RoleRepository roleRepository;
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;


    private final LoyaltyPointsRepository loyaltyPointsRepository;


    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Role findRoleByUserId(int userId) {
        return roleRepository.findById(userId);
    }

    public LoyaltyPoints findLoyaltyPointsByUserId(int userId) {
        return loyaltyPointsRepository.findByUserId(userId);
    }
    public List<UserResponse> getUsersByRole(String roleName) {
        List<User> users = userRepository.findAll();
        List<User> filteredUsers;
        if ("Customer".equalsIgnoreCase(roleName)) {
            filteredUsers = users.stream()
                    .filter(user -> user.getRole() != null && "Customer".equalsIgnoreCase(user.getRole().getRoleName()))
                    .collect(Collectors.toList());
        } else {
            filteredUsers = users.stream()
                    .filter(user -> user.getRole() != null && !"Customer".equalsIgnoreCase(user.getRole().getRoleName()))
                    .collect(Collectors.toList());
        }

        return filteredUsers.stream()
                .map(UserMapper::toResponse)
                .collect(Collectors.toList());
    }

    public MessageResponse updateUser(int userId, UserRequest userRequest){
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());
        user.setAddress(userRequest.getAddress());
        user.setPhone(userRequest.getPhone());
        user.setEmail(userRequest.getEmail());
        userRepository.save(user);
        return new MessageResponse("Successfully");
    }

    public List<OrderResponse> getOrderResponseByUserId(Integer userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        List<Order> orders = orderRepository.findByUser(user);
        return orders.stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<BuyResponse> getBuyResponsesByUserId(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        List<Order> orders = orderRepository.findByUser(user);

        Map<String, BuyResponse> buyResponseMap = new HashMap<>();

        orders.forEach(order -> order.getOrderDetails().forEach(orderDetail -> orderDetail.getTickets().forEach(ticket -> {

            String key = ticket.getType().getTypeName() + "_" +
                    ticket.getPurchaseDate() + "_" +
                    ticket.getExpirationDate() + "_" +
                    orderDetail.getId();
            BigDecimal quantity = BigDecimal.valueOf(orderDetail.getQuantity());
            BigDecimal price = ticket.getType().getPrice();
            buyResponseMap.merge(key,
                    new BuyResponse(
                            user.getId(),
                            ticket.getId(),
                            orderDetail.getId(),
                            ticket.getType().getTypeName(),
                            orderDetail.getQuantity(),
                            ticket.getStatus(),
                            ticket.getPurchaseDate(),
                            ticket.getExpirationDate(),
                            quantity.multiply(price)
                    ),
                    (existing, newResponse) -> {
                        return existing;
                    }
            );
        })));

        return new ArrayList<>(buyResponseMap.values());
    }
    public void updateUserStatus(Integer userId, String statusFromFrontend) {
        String status = statusFromFrontend.toUpperCase();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setAccountStatus(status);

        userRepository.save(user);
    }
}


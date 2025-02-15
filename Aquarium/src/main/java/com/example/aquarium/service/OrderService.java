package com.example.aquarium.service;

import com.example.aquarium.bean.response.BuyResponse;
import com.example.aquarium.bean.response.ChartData;
import com.example.aquarium.bean.response.OrderResponse;
import com.example.aquarium.exception.ResourceNotFoundException;
import com.example.aquarium.mapper.OrderMapper;
import com.example.aquarium.model.*;
import com.example.aquarium.repository.OrderDetailsRepository;
import com.example.aquarium.repository.OrderRepository;
import com.example.aquarium.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.math.BigDecimal;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class OrderService {


    private final OrderRepository orderRepository;


    private final OrderMapper orderMapper;
    private final OrderDetailsRepository orderDetailsRepository;
    private final TicketRepository ticketRepository;


    public Optional<OrderResponse> findById(int id) {
        return orderRepository.findById(id)
                .map(order -> orderMapper.toResponse(order));
    }

    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<BuyResponse> getOrderByOrderId(Integer orderId) {
        Iterable<Integer> ids = Collections.singletonList(orderId);
        List<Order> orders = orderRepository.findAllById(ids);
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
                            order.getUser().getId(),
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

    public List<ChartData> getLastSixMonthsRevenue() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime sixMonthsAgo = now.minusMonths(5).withDayOfMonth(1);

        List<String> lastSixMonths = IntStream.range(0, 6)
                .mapToObj(i -> sixMonthsAgo.plusMonths(i).getMonth().getDisplayName(TextStyle.SHORT, Locale.getDefault()))
                .collect(Collectors.toList());

        Map<String, BigDecimal> revenueByMonth = orderRepository.findAll().stream()
                .filter(order -> {
                    LocalDateTime createdAt = order.getCreatedAt().toLocalDateTime();
                    return createdAt.isAfter(sixMonthsAgo);
                })
                .collect(Collectors.groupingBy(
                        order -> order.getCreatedAt().toLocalDateTime().getMonth().getDisplayName(TextStyle.SHORT, Locale.getDefault()),
                        Collectors.mapping(
                                Order::getTotalAmount,
                                Collectors.reducing(BigDecimal.ZERO, BigDecimal::add)
                        )
                ));

        return lastSixMonths.stream()
                .map(month -> new ChartData(month, revenueByMonth.getOrDefault(month, BigDecimal.ZERO).longValue()))
                .collect(Collectors.toList());
    }


    public List<ChartData> getWeeklySalesData() {
        LocalDateTime currentDate = LocalDateTime.now();
        LocalDateTime startOfWeek = currentDate.minusWeeks(5);

        List<OrderDetails> orderDetailsList = orderDetailsRepository.findAll();
        List<Ticket> tickets = ticketRepository.findAll();

        Map<String, BigDecimal> weeklySales = tickets.stream()
                .filter(ticket -> ticket.getPurchaseDate().isAfter(startOfWeek))
                .collect(Collectors.groupingBy(
                        ticket -> "Week " + getWeekOfYear(ticket.getExpirationDate()),
                        Collectors.mapping(ticket -> {
                            Optional<OrderDetails> orderDetail = orderDetailsList.stream()
                                    .filter(od -> od.getId() == ticket.getOrderDetails().getId())
                                    .findFirst();
                            if (orderDetail.isPresent()) {
                                BigDecimal quantity = new BigDecimal(orderDetail.get().getQuantity());
                                BigDecimal price = orderDetail.get().getPrice();

                                BigDecimal totalPrice = quantity.multiply(price);
                                return totalPrice;
                            }
                            return BigDecimal.ZERO;
                        }, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ));

        return weeklySales.entrySet().stream()
                .map(entry -> new ChartData(entry.getKey(), entry.getValue().longValue()))
                .collect(Collectors.toList());
    }

    private int getWeekOfYear(LocalDateTime expirationDate) {
        return expirationDate.get(WeekFields.of(Locale.getDefault()).weekOfYear());
    }

    public boolean updateTicketStatus(Integer orderDetailsId, TicketStatus status) {
        if (orderDetailsId == null || status == null) {
            throw new IllegalArgumentException("OrderDetailsId and status must not be null");
        }

        List<Ticket> tickets = ticketRepository.findAllByOrderDetailsId(orderDetailsId);
        if (tickets.isEmpty()) {
            return false;
        }

        // Update tickets in batch to reduce database calls
        tickets.forEach(ticket -> ticket.setStatus(status));
        ticketRepository.saveAll(tickets); // Save all updated tickets in one call

        return true;
    }


}



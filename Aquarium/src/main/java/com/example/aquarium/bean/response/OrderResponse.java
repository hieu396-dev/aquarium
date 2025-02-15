package com.example.aquarium.bean.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Timestamp;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderResponse {
    private Integer id;
    private String email;
    private BigDecimal totalAmount;
    private String status;
    private String paymentMethod;
    private BigDecimal discount;
    private Timestamp createdAt;

}


package com.example.aquarium.bean.response;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TicketResponse {
    private Integer id;
    private LocalDateTime purchaseDate;
    private LocalDateTime expirationDate;
    private String status;
    private String typeName;
}
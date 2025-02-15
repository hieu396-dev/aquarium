package com.example.aquarium.bean.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class TypeResponse {
    private Integer id;
    private BigDecimal price;
    private String typeName;
    private String description;
    private String status;
}

package com.example.aquarium.bean.request;

import com.example.aquarium.model.Status;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class TypeRequest {

    @NotNull(message = "Price is mandatory")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
    private BigDecimal price;

    @NotBlank(message = "Type name is mandatory")
    @Size(max = 20, message = "Type name must not exceed 20 characters")
    private String typeName;

    @Size(max = 100, message = "Description must not exceed 100 characters")
    private String description;

    private Status status;

}


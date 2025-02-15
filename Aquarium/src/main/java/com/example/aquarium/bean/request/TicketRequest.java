package com.example.aquarium.bean.request;

import com.example.aquarium.model.TicketStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TicketRequest {

    @NotNull(message = "Purchase date is mandatory")
    private LocalDateTime purchaseDate;

    @NotNull(message = "Expiration date is mandatory")
    private LocalDateTime expirationDate;


    private TicketStatus status;

    @NotNull(message = "Type ID is mandatory")
    private Integer typeId;
}

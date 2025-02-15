package com.example.aquarium.model;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum TicketStatus {
    PENDING,
    CONFIRMED,
    USED,
    EXPIRED,
    ON_HOLD;

    @JsonCreator
    public static TicketStatus fromString(String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Status cannot be null or blank");
        }
        for (TicketStatus ticketStatus : TicketStatus.values()) {
            if (ticketStatus.name().equalsIgnoreCase(status)) {
                return ticketStatus;
            }
        }
        throw new IllegalArgumentException("Invalid status: \"" + status + "\"");
    }
}

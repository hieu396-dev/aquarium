package com.example.aquarium.repository;

import com.example.aquarium.model.Ticket;
import com.example.aquarium.model.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Integer> {
    List<Ticket> findByExpirationDateBeforeAndStatus(LocalDateTime expirationDate, TicketStatus status);
    List<Ticket> findAllByOrderDetailsId(Integer orderDetailsId);
}
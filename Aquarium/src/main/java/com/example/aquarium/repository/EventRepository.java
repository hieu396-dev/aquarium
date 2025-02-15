package com.example.aquarium.repository;


import com.example.aquarium.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
    boolean existsByEventName(String typeName);
}


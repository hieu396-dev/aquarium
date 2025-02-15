package com.example.aquarium.repository;

import com.example.aquarium.model.Species;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpeciesRespository extends JpaRepository<Species, Integer> {
}

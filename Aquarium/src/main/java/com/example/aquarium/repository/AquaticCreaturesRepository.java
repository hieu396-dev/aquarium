package com.example.aquarium.repository;

import com.example.aquarium.model.AquaticCreatures;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface AquaticCreaturesRepository extends JpaRepository<AquaticCreatures, Integer> {
    boolean existsBySpeciesId(Integer speciesId);
    @Modifying
    @Transactional
    @Query("UPDATE AquaticCreatures a SET a.species.status = 'INACTIVE' WHERE a.species.id = ?1")
    void updateAreaIdToNullBySpeciesId(int speceisId);
    boolean existsAquaticCreaturesByName(String aquaticCreatureName);
}

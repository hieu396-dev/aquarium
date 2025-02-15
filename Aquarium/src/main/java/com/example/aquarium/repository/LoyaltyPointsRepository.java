package com.example.aquarium.repository;
import com.example.aquarium.model.LoyaltyPoints;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoyaltyPointsRepository extends JpaRepository<LoyaltyPoints, Integer> {
    LoyaltyPoints findByUserId(int userId);
}

